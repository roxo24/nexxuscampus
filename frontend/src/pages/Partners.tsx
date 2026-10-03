import { useState } from 'react';
import { Icon } from '../components/Icon';
import { Avatar } from '../components/ui';
import { talent } from '../data/mock';

export function Partners({ initialConnected, onChat }: { initialConnected: number[]; onChat: (person: string) => void }) {
  const [connected, setConnected] = useState<number[]>(initialConnected);
  const [notice, setNotice] = useState('');
  const connect = (person: typeof talent[number]) => {
    if (connected.includes(person.id)) return;
    setConnected(current => [...current, person.id]);
    setNotice(`La conexión con ${person.name} ya está lista para conversar.`);
    window.setTimeout(() => setNotice(''), 3000);
  };
  return <div className="page partners-page">
    <section className="partners-hero"><div><div className="eyebrow">SOCIOS RECOMENDADOS</div><h1>Conecta con personas que pueden impulsar tu siguiente idea</h1><p>La IA organizó estas recomendaciones según tus habilidades, intereses y objetivos de colaboración.</p></div><div className="partners-hero-stat"><strong>{talent.length}</strong><span>perfiles compatibles</span><small>Actualizado ahora</small></div></section>
    <div className="partners-toolbar"><div><span><Icon name="spark" size={16}/> Matching inteligente activo</span><small>La institución permanece oculta hasta que ambas partes acepten conectar.</small></div><div className="partner-avatars">{talent.slice(0,4).map(person => <Avatar key={person.id} label={person.name} color={person.color} small/>)}<span>+{talent.length - 4}</span></div></div>
    <section className="partners-grid">{talent.map(person => {
      const isConnected = connected.includes(person.id);
      return <article className={`partner-card ${isConnected ? 'connected' : ''}`} key={person.id}>
        <div className="partner-card-top"><span className="partner-avatar-wrap"><Avatar label={person.name} color={person.color}/><i>{person.match}%</i></span><span className="partner-match"><Icon name="spark" size={13}/> Match recomendado</span></div>
        <div><h2>{person.name}</h2><p>{person.career} · {person.cycle}</p></div>
        <div className="partner-skills">{person.skills.map(skill => <span key={skill}>{skill}</span>)}</div>
        <div className="partner-insight"><small>POR QUÉ PODRÍAN CONECTAR</small><p>{person.id % 3 === 0 ? 'Aporta una perspectiva analítica que complementa tus decisiones de producto.' : person.id % 2 === 0 ? 'Sus habilidades creativas pueden fortalecer la experiencia y comunicación de tu idea.' : 'Su perfil combina ejecución, estrategia y una alta afinidad con tus intereses.'}</p></div>
        <button className={isConnected ? 'chat-ready' : ''} onClick={() => isConnected ? onChat(person.name) : connect(person)}>{isConnected ? <Icon name="chat" size={16}/> : null} {isConnected ? 'Chatear' : 'Conectar'}</button>
      </article>;
    })}</section>
    {notice && <div className="connection-toast" role="status"><span><Icon name="check" size={17}/></span><div><b>Conexión confirmada</b><p>{notice}</p></div><button aria-label="Cerrar" onClick={() => setNotice('')}><Icon name="x" size={16}/></button></div>}
  </div>;
}
