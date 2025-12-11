import React, { useEffect, useRef, useState } from 'react';
import Head from '@docusaurus/Head';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import { Award, Flame, Share2, Users, MessageCircle, Trophy, Gift, Megaphone, Coins } from 'lucide-react';
import styles from '../css/mvp.module.css';
import mvpJson from '../../data/mvp.json';

export interface MvpInfo {
  id: string;
  name: string;
  title: string;
  description: string;
  photoFile: string;
}

declare const require: any;
export const imagesCtx = typeof require !== 'undefined' ? require.context('/static/img/MVP', false, /\.(png|jpe?g|webp)$/) : null;

export function getPhotoUrl(fileName: string): string {
  if (!imagesCtx) return '';
  const keys: string[] = imagesCtx.keys();
  const key = keys.find((k) => k.endsWith(fileName));
  const mod = key ? imagesCtx(key) : null;
  return mod?.default || '';
}

const mvpList: MvpInfo[] = mvpJson as MvpInfo[];

function MvpCard({ mvp, index, onClick }: { mvp: MvpInfo; index: number; onClick: (m: MvpInfo) => void }) {
  const [loaded, setLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const photoUrl = getPhotoUrl(mvp.photoFile);
  const isPriority = index < 4;

  return (
    <div ref={cardRef} className={styles.card} role="button" tabIndex={0} onClick={() => onClick(mvp)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(mvp); }}>
      <div className={styles.photoWrap}>
        {photoUrl && (
          <img
            className={`${styles.photo} ${loaded ? styles.photoLoaded : ''}`}
            src={photoUrl}
            alt={`${mvp.name} ${mvp.title}`}
            loading="eager"
            fetchPriority={isPriority ? 'high' : 'auto'}
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(true)}
          />
        )}
      </div>
      <div className={styles.cardInfo}>
        <div className={styles.cardName}>{mvp.name}</div>
        <div className={styles.cardTitle}>{mvp.title}</div>
      </div>
    </div>
  );
}

function MvpModal({ mvp, onClose }: { mvp: MvpInfo; onClose: () => void }) {
  const [photoLoaded, setPhotoLoaded] = useState(false);
  const photoUrl = getPhotoUrl(mvp.photoFile);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);
  return (
    <div className={styles.modalBackdrop} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.modalContent} role="dialog" aria-modal="true">
        <button className={styles.modalClose} onClick={onClose} aria-label="关闭">×</button>
        <div className={styles.modalHeader}>
          <div className={styles.modalName}>{mvp.name}</div>
          <div className={styles.modalTitle}>{mvp.title}</div>
        </div>
        <div className={styles.modalBody}>
          {photoUrl && (
            <img
              className={`${styles.modalPhoto} ${photoLoaded ? styles.photoLoaded : ''}`}
              src={photoUrl}
              alt={`${mvp.name} ${mvp.title}`}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              onLoad={() => setPhotoLoaded(true)}
              onError={() => setPhotoLoaded(true)}
            />
          )}
          <div className={styles.modalDesc}>
            <p className={styles.modalDescText}>{mvp.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MVPPage(): React.ReactElement {
  const [selected, setSelected] = useState<MvpInfo | null>(null);
  const [eligibilityExpanded, setEligibilityExpanded] = useState<string | null>(null);

  return (
    <Layout title="KWDB MVP" description="KWDB MVP:共建多模数据库新生态">
      <Head children={
        <>
          <meta name="keyword" content="KWDB MVP" />
          {mvpList.slice(0, 8).map((m, i) => {
            const u = getPhotoUrl(m.photoFile);
            return u ? <link key={i} rel="preload" as="image" href={u} /> : null;
          })}
        </>
      } />
      <div className={styles.mvpContainer}>
        <section className={styles.heroSection}>
          <div className="container">
            <div className={styles.heroInner}>
              <div className={styles.heroText}>
                <h1 className={styles.heroTitle}>KWDB MVP:共建多模数据库新生态</h1>
                <p className={styles.heroSubtitle}>在 KWDB 生态建设与技术推进中做出突出贡献的技术专家，凭借对数据库技术及开源技术的深厚热爱，以及在技术分享、社区建设中的积极表现，为 KWDB 开源生态注入了蓬勃活力。</p>
                <a
                  href="https://zzqonnd3sc.feishu.cn/share/base/form/shrcnq6E04iZ7YvfYqYFEovFFmc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.applyCta} ${styles.btn} ${styles.btnPrimary} ${styles.heroApply}`}
                  aria-label="申请成为 KWDB MVP"
                >申请成为 KWDB MVP</a>
              </div>
              <img
                className={styles.heroImage}
                src={useBaseUrl('img/MVP/mvp.png')}
                alt="KWDB MVP 视觉海报"
                loading="eager"
                decoding="async"
                sizes="(max-width: 768px) 90vw, 28vw"
              />
            </div>
          </div>
        </section>

        <section className={styles.eligibilitySection}>
          <div className="container">
              <h2 className={styles.eligibilityTitle}><span className={styles.eligibilityIcon}><Award size={20} /></span>参与资格要求</h2>
              <div className={styles.eligibilityGrid}>
                <div
                  className={`${styles.eligibilityItemCard} ${styles.techCard} ${styles.bgAiChip} ${eligibilityExpanded === 'hot' ? styles.expanded : ''}`}
                  role="button"
                  tabIndex={0}
                  aria-label="技术热忱资格说明"
                  aria-expanded={eligibilityExpanded === 'hot'}
                  onClick={() => setEligibilityExpanded(eligibilityExpanded === 'hot' ? null : 'hot')}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setEligibilityExpanded(eligibilityExpanded === 'hot' ? null : 'hot'); }}
                  onTouchEnd={() => setEligibilityExpanded(eligibilityExpanded === 'hot' ? null : 'hot')}
                >
                  <div className={styles.itemHeader}>
                    <span className={`${styles.itemIcon} ${styles.iconHot}`}><Flame size={18} /></span>
                    <div className={styles.itemTitle}>技术热忱</div>
                  </div>
                  <div className={styles.itemDesc} id="eligibility-hot-desc">
                    <p className={styles.itemText}>对时序数据库、多模数据库及开源技术领域抱有浓厚兴趣，并具备深入研究与实践经验。</p>
                  </div>
                </div>
                <div
                  className={`${styles.eligibilityItemCard} ${styles.techCard} ${styles.bgDataFlow} ${eligibilityExpanded === 'share' ? styles.expanded : ''}`}
                  role="button"
                  tabIndex={0}
                  aria-label="乐于分享资格说明"
                  aria-expanded={eligibilityExpanded === 'share'}
                  onClick={() => setEligibilityExpanded(eligibilityExpanded === 'share' ? null : 'share')}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setEligibilityExpanded(eligibilityExpanded === 'share' ? null : 'share'); }}
                  onTouchEnd={() => setEligibilityExpanded(eligibilityExpanded === 'share' ? null : 'share')}
                >
                  <div className={styles.itemHeader}>
                    <span className={`${styles.itemIcon} ${styles.iconShare}`}><Share2 size={18} /></span>
                    <div className={styles.itemTitle}>乐于分享</div>
                  </div>
                  <div className={styles.itemDesc} id="eligibility-share-desc">
                    <p className={styles.itemText}>积极通过视频创作、技术博客、行业演讲、代码贡献或社区活动等形式，分享技术见解与实践成果。</p>
                  </div>
                </div>
                <div
                  className={`${styles.eligibilityItemCard} ${styles.techCard} ${styles.bgFutureGrid} ${eligibilityExpanded === 'active' ? styles.expanded : ''}`}
                  role="button"
                  tabIndex={0}
                  aria-label="社区活跃资格说明"
                  aria-expanded={eligibilityExpanded === 'active'}
                  onClick={() => setEligibilityExpanded(eligibilityExpanded === 'active' ? null : 'active')}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setEligibilityExpanded(eligibilityExpanded === 'active' ? null : 'active'); }}
                  onTouchEnd={() => setEligibilityExpanded(eligibilityExpanded === 'active' ? null : 'active')}
                >
                  <div className={styles.itemHeader}>
                    <span className={`${styles.itemIcon} ${styles.iconActive}`}><Users size={18} /></span>
                    <div className={styles.itemTitle}>社区活跃</div>
                  </div>
                  <div className={styles.itemDesc} id="eligibility-active-desc">
                    <p className={styles.itemText}>技术社区、开源项目或行业会议中表现活跃的参与者。</p>
                  </div>
                </div>
                <div
                  className={`${styles.eligibilityItemCard} ${styles.techCard} ${styles.bgTechMatrix} ${eligibilityExpanded === 'support' ? styles.expanded : ''}`}
                  role="button"
                  tabIndex={0}
                  aria-label="社区支持资格说明"
                  aria-expanded={eligibilityExpanded === 'support'}
                  onClick={() => setEligibilityExpanded(eligibilityExpanded === 'support' ? null : 'support')}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setEligibilityExpanded(eligibilityExpanded === 'support' ? null : 'support'); }}
                  onTouchEnd={() => setEligibilityExpanded(eligibilityExpanded === 'support' ? null : 'support')}
                >
                  <div className={styles.itemHeader}>
                    <span className={`${styles.itemIcon} ${styles.iconSupport}`}><MessageCircle size={18} /></span>
                    <div className={styles.itemTitle}>社区支持</div>
                  </div>
                  <div className={styles.itemDesc} id="eligibility-support-desc">
                    <p className={styles.itemText}>已加入KWDB官方社区微信群，并积极参与用户问题解答与社区建设。</p>
                  </div>
                </div>
              </div>
          </div>
        </section>

        <section className={styles.gridSection}>
          <div className="container">
            <h2 className={styles.eligibilityTitle}><span className={styles.eligibilityIcon}><Users size={20} /></span>2025 KWDB MVP</h2>
            <p className={styles.listNote}>（排名不分先后，按姓名首字母为序）</p>
            <div className={styles.grid}>
              {mvpList.map((m, i) => (
                <div key={m.id}>
                  <MvpCard mvp={m} index={i} onClick={setSelected} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {selected && (
          <MvpModal mvp={selected} onClose={() => setSelected(null)} />
        )}

        <section className={styles.benefitsSection}>
          <div className="container">
            <h2 className={styles.benefitsTitle}><span className={styles.eligibilityIcon}><Gift size={20} /></span>权益与支持</h2>
            <div className={styles.benefitsGrid}>
              <div className={styles.benefitCard}>
                <div className={styles.benefitHeader}>
                  <span className={`${styles.benefitIcon} ${styles.iconPrimary}`}><Megaphone size={20} /></span>
                  <div className={styles.benefitName}>品牌曝光机会</div>
                </div>
                <p className={styles.benefitText}>作为 KWDB 官方认证的专家，你的个人简介、技术成果将在 KWDB 官网、公众号、行业会议等平台展示，提升行业影响力。</p>
              </div>

              <div className={styles.benefitCard}>
                <div className={styles.benefitHeader}>
                  <span className={`${styles.benefitIcon} ${styles.iconAccent}`}><Trophy size={20} /></span>
                  <div className={styles.benefitName}>定制荣誉认证</div>
                </div>
                <p className={styles.benefitText}>颁发 MVP 专属定制奖杯，彰显技术影响力。</p>
              </div>

              <div className={styles.benefitCard}>
                <div className={styles.benefitHeader}>
                  <span className={`${styles.benefitIcon} ${styles.iconSuccess}`}><Gift size={20} /></span>
                  <div className={styles.benefitName}>专属权益保障</div>
                </div>
                <ul className={styles.benefitList}>
                  <li>享受社区定制 MVP 礼包</li>
                  <li>包括技术培训课程、行业峰会门票、与行业大咖面对面交流的机会等</li>
                </ul>
              </div>

              <div className={styles.benefitCard}>
                <div className={styles.benefitHeader}>
                  <span className={`${styles.benefitIcon} ${styles.iconGold}`}><Coins size={20} /></span>
                  <div className={styles.benefitName}>积分兑换权益</div>
                </div>
                <p className={styles.benefitText}>开放 MVP 专属积分兑换渠道，可凭积分兑换对应奖品。</p>
              </div>
            </div>
          </div>
        </section>

        
        
      </div>
    </Layout>
  );
}
