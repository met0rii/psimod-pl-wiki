import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {ArrowUpRight, Swords, Download} from 'lucide-react';

export function ModIdentity() {
  const {siteConfig: {customFields: {profile}}} = useDocusaurusContext();
  return <div className="mod-identity">
    <div className="mod-mark"><Swords size={22}/></div>
    <div><strong>{profile.name}</strong><span>{profile.game}</span></div>
  </div>;
}

export function SidebarLinks() {
  const {siteConfig: {customFields: {profile}}} = useDocusaurusContext();
  return <div className="sidebar-links">
    <Link href={profile.installationUrl}><Download size={15}/> Zainstaluj modyfikację <ArrowUpRight size={14}/></Link>
    <Link href="https://sefaris.eu">Wróć do Sefaris <ArrowUpRight size={14}/></Link>
    {profile.prototype && <span className="prototype-label">Podgląd wzoru wiki</span>}
  </div>;
}

export function HomeHeader({title}) {
  const {siteConfig: {customFields: {profile}}} = useDocusaurusContext();
  const background = useBaseUrl(profile.heroImage);
  return <header className="wiki-hero wiki-home-header" style={{backgroundImage: `linear-gradient(90deg, rgba(15,18,13,.94) 0%, rgba(15,18,13,.73) 42%, rgba(15,18,13,.18) 100%), url("${background}")`}}>
    <span className="eyebrow"><span className="tiny-rule"/> Sefaris Wiki</span>
    <h1 id="wiki-title">{title}</h1>
    {profile.heroDescription && <p className="wiki-home-description">{profile.heroDescription}</p>}
  </header>;
}

export function ChapterLinks({chapters}) {
  return <div className="quick-links chapter-links">{chapters.map(({title, text, url}, index) => <Link to={url} className="quick-link" key={url}><span className="chapter-number">{String(index + 1).padStart(2, '0')}</span><strong>{title}</strong><span>{text}</span><ArrowUpRight className="quick-arrow" size={16}/></Link>)}</div>;
}

export function SourceNote({path}) {
  const {siteConfig: {customFields: {profile}}} = useDocusaurusContext();
  const sourcePath = path.split('/').map(encodeURIComponent).join('/');
  return <aside className="source-note"><Link href={`${profile.repository}/blob/${profile.branch}/docs/${sourcePath}`}>Materiał źródłowy <ArrowUpRight size={13}/></Link></aside>;
}
