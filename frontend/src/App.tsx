import { useState } from 'react';
import { talent } from './data/mock';
import { AppShell } from './layout/AppShell';
import { AiLoadingScreen } from './pages/AiLoadingScreen';
import { Onboarding } from './pages/Onboarding';
import { SuggestedProfiles } from './pages/SuggestedProfiles';
import type { Screen } from './types';

export default function App() {
  const [stage, setStage] = useState<'onboarding' | 'loading' | 'suggestions' | 'app'>('onboarding');
  const [entryScreen, setEntryScreen] = useState<Screen>('talent');
  const [initialConnections, setInitialConnections] = useState<number[]>([]);
  const [currentStudent, setCurrentStudent] = useState<any>(null);

  const beginMatching = (student?: any) => {
    if (student) setCurrentStudent(student);
    setStage('loading');
    window.setTimeout(() => setStage('suggestions'), 2800);
  };

  if (stage === 'loading') return <AiLoadingScreen/>;
  if (stage === 'suggestions') return <SuggestedProfiles student={currentStudent} onContinue={connections => { setInitialConnections(connections); setEntryScreen(connections.length > 0 ? 'partners' : 'talent'); setStage('app'); }} onBack={() => setStage('onboarding')}/>;
  if (stage === 'app') return <AppShell initialScreen={entryScreen} initialConnections={initialConnections} student={currentStudent}/>;
  return <Onboarding onComplete={beginMatching}/>;
}
