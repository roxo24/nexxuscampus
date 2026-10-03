import { Icon } from '../components/Icon';
import { Logo } from '../components/ui';

export function AiLoadingScreen() {
  return <main className="ai-loading-screen" aria-live="polite" aria-busy="true">
    <div className="ai-loading-brand"><Logo/></div>
    <section className="ai-loading-content">
      <div className="ai-loader" role="status" aria-label="Analizando tu perfil con inteligencia artificial">
        <span><Icon name="spark" size={27}/></span>
      </div>
      <div>
        <div className="eyebrow">MATCHING INTELIGENTE</div>
        <h1>Buscando conexiones para ti</h1>
        <p>La IA está analizando tus habilidades y proyectos compatibles<span className="loading-dots" aria-hidden="true"><i/><i/><i/></span></p>
      </div>
    </section>
    <small className="ai-loading-foot">Preparando tu experiencia en NexusCampus</small>
  </main>;
}
