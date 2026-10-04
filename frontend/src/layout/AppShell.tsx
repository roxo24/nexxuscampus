import { useMemo, useState } from 'react';
import { Icon } from '../components/Icon';
import { InviteModal, Notifications, Offboarding } from '../components/Modals';
import { Avatar, Logo } from '../components/ui';
import { ventures, talent } from '../data/mock';
import { Dashboard } from '../pages/Dashboard';
import { Explore } from '../pages/Explore';
import { Messages } from '../pages/Messages';
import { Partners } from '../pages/Partners';
import { Profile } from '../pages/Profile';
import { ProjectDetail } from '../pages/ProjectDetail';
import { Publish } from '../pages/Publish';
import type { Screen } from '../types';

export function AppShell({ 
  initialScreen, 
  initialConnections,
  student
}: { 
  initialScreen: Screen; 
  initialConnections: number[];
  student?: { nombres: string; apellidos: string; carrera: string; correo_institucional: string };
}) {
  const [screen, setScreen] = useState<Screen>(initialScreen);
  const [selectedProject, setSelectedProject] = useState(ventures[0]);
  const [drawer, setDrawer] = useState(false);
  const [chatProject, setChatProject] = useState('Vitrina Circular');
  const [invite, setInvite] = useState<typeof talent[number] | null>(null);
  const [toast, setToast] = useState('');
  const [offboarding, setOffboarding] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const studentName = student ? `${student.nombres} ${student.apellidos}` : 'Carlos Mendoza';
  const nav = useMemo(() => [
    ['dashboard','grid','Inicio'],['talent','users','Descubrir'],['partners','spark','Socios'],['publish','plus','Emprende'],['messages','chat','Mensajes'],['profile','user','Mi perfil']
  ] as [Screen,string,string][], []);
  const sent = () => { setInvite(null); setToast('Invitación enviada correctamente. Te avisaremos cuando responda.'); window.setTimeout(() => setToast(''), 3500); };
  return <div className={dark ? 'app dark' : 'app'}>
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}><div className="sidebar-logo"><Logo/><button onClick={() => setCollapsed(!collapsed)}><Icon name="menu"/></button></div><nav><small>MENÚ PRINCIPAL</small>{nav.map(n => <button className={screen===n[0]?'active':''} onClick={() => setScreen(n[0])} key={n[0]}><Icon name={n[1]}/><span>{n[2]}</span>{n[0]==='messages'&&<em>2</em>}</button>)}</nav><div className="sidebar-card"><Icon name="spark"/><b>Completa tu perfil</b><p>Estás al 82%. Añade tu experiencia para mejores matches.</p><span><i/></span></div></aside>
    <div className="main-shell"><header className="topbar"><div className="top-actions"><button onClick={() => setDark(!dark)} aria-label="Cambiar tema"><Icon name="moon"/></button><button className="notification-button" onClick={() => setDrawer(true)} aria-label="Notificaciones"><Icon name="bell"/><i>4</i></button><div className="top-divider"/><span><b>Modo talento</b><small>Buscando equipo</small></span><Avatar label={studentName} color="coral" small/></div></header>
      <main className={screen === 'messages' ? 'chat-main' : ''}>{screen==='dashboard'&&<Dashboard go={setScreen}/>} {screen==='talent'&&<Explore onInvite={person => setInvite(person ?? null)} onOpenProject={project => { setSelectedProject(project); setScreen('project-detail'); }}/>} {screen==='partners'&&<Partners initialConnected={initialConnections} onChat={person => { setChatProject(person); setScreen('messages'); }}/>} {screen==='publish'&&<Publish onCreated={() => setScreen('talent')}/>} {screen==='messages'&&<Messages initialProject={chatProject} onLeave={() => setOffboarding(true)}/>} {screen==='profile'&&<Profile/>} {screen==='project-detail'&&<ProjectDetail project={selectedProject} onBack={() => setScreen('dashboard')} onDiscover={() => setScreen('talent')}/>}</main>
    </div>
    {drawer&&<Notifications close={() => setDrawer(false)} onAccept={project => { setChatProject(project); setDrawer(false); setScreen('messages'); }}/>}
    {invite&&<InviteModal person={invite} onClose={() => setInvite(null)} onSent={sent}/>}
    {offboarding&&<Offboarding close={() => setOffboarding(false)}/>}
    {toast&&<div className="toast"><span><Icon name="check"/></span><div><b>Solicitud enviada</b><p>{toast}</p></div><button onClick={() => setToast('')}><Icon name="x"/></button></div>}
  </div>;
}
