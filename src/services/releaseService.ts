export interface ReleaseAsset {
  name: string;
  url: string;
  size?: number;
  platform?: string;
}

export interface Release {
  version: string;
  date: string;
  type: 'stable' | 'beta';
  highlights: string[];
  downloadUrl: string;
  assets: ReleaseAsset[];
  source: 'gitee' | 'github';
  body: string;
}

export interface ReleaseData {
  gitee: Release[];
  github: Release[];
}

interface CacheData {
  timestamp: number;
  data: ReleaseData;
}

const CACHE_KEY = 'kwdb_releases_cache_v2'; // Changed key to avoid conflict with old cache
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

const GITEE_API_URL = 'https://gitee.com/api/v5/repos/kwdb/kwdb/releases?page=1&per_page=20';
const GITHUB_API_URL = 'https://api.github.com/repos/kwdb/kwdb/releases';

const DEFAULT_RELEASES: ReleaseData = {
  gitee: [
    {
      version: "v2.0.3.0",
      date: "2024-01-15",
      type: "stable",
      highlights: ["核心性能优化", "系统稳定性增强", "已知问题修复"],
      downloadUrl: "https://gitee.com/kwdb/kwdb/releases",
      assets: [
        {
          name: "kwdb_2.0.3.0_linux_amd64.tar.gz",
          url: "https://gitee.com/kwdb/kwdb/releases/download/v2.0.3.0/kwdb_2.0.3.0_linux_amd64.tar.gz",
          platform: "linux"
        }
      ],
      source: "gitee",
      body: "系统自动回退至默认版本信息"
    }
  ],
  github: []
};

// Helper to determine if a version is stable or beta
const getReleaseType = (version: string): 'stable' | 'beta' => {
  return version.toLowerCase().includes('beta') || version.toLowerCase().includes('rc') ? 'beta' : 'stable';
};

// Helper to extract highlights from release notes (simple implementation)
const extractHighlights = (body: string): string[] => {
  if (!body) return [];
  const lines = body.split('\n');
  // Extract bullet points
  const bullets = lines
    .filter(line => line.trim().match(/^[-*]\s/))
    .map(line => line.replace(/^[-*]\s/, '').trim())
    .slice(0, 3); // Take first 3 bullets as highlights
  
  return bullets.length > 0 ? bullets : ['性能优化', '安全性增强', 'Bug 修复'];
};

const fetchWithRetry = async (url: string, options: RequestInit, retries = 3, backoff = 1000): Promise<Response> => {
  try {
    const response = await fetch(url, options);
    
    if (response.status === 429) {
      throw new Error('Rate limit exceeded');
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    if (retries > 0) {
      console.warn(`Fetch failed, retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    throw error;
  }
};

const fetchGiteeReleases = async (): Promise<Release[]> => {
  try {
    const response = await fetchWithRetry(GITEE_API_URL, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    });
    
    const data = await response.json();

    return data.map((item: any) => ({
      version: item.tag_name,
      date: item.created_at.split('T')[0],
      type: getReleaseType(item.tag_name),
      highlights: extractHighlights(item.body),
      downloadUrl: item.html_url,
      assets: item.assets.map((asset: any) => ({
        name: asset.name,
        url: asset.browser_download_url,
        size: asset.size
      })),
      source: 'gitee',
      body: item.body
    }));
  } catch (error) {
    console.error('Error fetching Gitee releases:', error);
    return [];
  }
};

const fetchGithubReleases = async (): Promise<Release[]> => {
  try {
    const response = await fetchWithRetry(GITHUB_API_URL, {
      headers: {
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    const data = await response.json();

    return data.map((item: any) => ({
      version: item.tag_name,
      date: item.published_at.split('T')[0],
      type: item.prerelease ? 'beta' : 'stable',
      highlights: extractHighlights(item.body),
      downloadUrl: item.html_url,
      assets: item.assets.map((asset: any) => ({
        name: asset.name,
        url: asset.browser_download_url,
        size: asset.size
      })),
      source: 'github',
      body: item.body
    }));
  } catch (error) {
    console.error('Error fetching GitHub releases:', error);
    return [];
  }
};

const processReleases = (releases: Release[]): Release[] => {
  // Filter for semantic versioning (vX.Y.Z)
  // Regex: ^v?\d+\.\d+\.\d+$ (matches v1.2.3 or 1.2.3)
  // Also handle things like v2.0.3.0 if that's considered semantic in this project context.
  // The example shows "V3.0.0", "V2.0.3.2".
  // Strict semantic version is X.Y.Z. But KWDB seems to use 4 digits sometimes.
  // Requirement: "符合语义化版本规范(vX.Y.Z)". This usually implies 3 parts.
  // But if I see "V2.0.3.2" in the example, maybe I should allow it?
  // "vX.Y.Z" implies 3 parts. I will stick to standard SemVer or loosely standard.
  // Let's use a regex that allows 3 or 4 parts to be safe with existing data, but the requirement says vX.Y.Z.
  // Let's try to match strictly first. If too few, maybe relax.
  // Regex: /^v?\d+\.\d+\.\d+$/i
  
  const semverRegex = /^v?\d+\.\d+\.\d+$/i;
  
  return releases
    .filter(r => semverRegex.test(r.version))
    .sort((a, b) => {
       // Sort descending by date or version? Requirement: "按版本号降序排列"
       // String comparison works for "v3.0.0" vs "v2.0.0".
       // For "v1.10.0" vs "v1.2.0", string comparison fails.
       // Better to use a semver compare function.
       // Simple version: remove 'v', split by '.', compare numbers.
       const vA = a.version.replace(/^v/i, '').split('.').map(Number);
       const vB = b.version.replace(/^v/i, '').split('.').map(Number);
       
       for (let i = 0; i < Math.max(vA.length, vB.length); i++) {
         const numA = vA[i] || 0;
         const numB = vB[i] || 0;
         if (numA > numB) return -1;
         if (numA < numB) return 1;
       }
       return 0;
    })
    .slice(0, 5); // Top 5
};

export const getReleases = async (forceRefresh = false): Promise<ReleaseData> => {
  // Check cache
  if (!forceRefresh) {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { timestamp, data } = JSON.parse(cached) as CacheData;
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data;
        }
      } catch (e) {
        console.error('Error parsing cache:', e);
      }
    }
  }

  // Fetch from APIs in parallel
  const [giteeData, githubData] = await Promise.all([
    fetchGiteeReleases(),
    fetchGithubReleases()
  ]);

  // Process data individually
  const processedData: ReleaseData = {
    gitee: processReleases(giteeData),
    github: processReleases(githubData)
  };

  // Fallback if both fail
  if (processedData.gitee.length === 0 && processedData.github.length === 0) {
    // If we have stale cache, maybe return it?
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
       try {
        const { data } = JSON.parse(cached) as CacheData;
        return data;
      } catch (e) {
        // ignore
      }
    }
    // If no cache, return default fallback
    return DEFAULT_RELEASES;
  }

  // Save to cache
  if (processedData.gitee.length > 0 || processedData.github.length > 0) {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      data: processedData
    }));
  }
  
  return processedData;
};
