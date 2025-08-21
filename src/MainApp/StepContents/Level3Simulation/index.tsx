import SimulationLevel from '../../../shared/SimulationLevel';
import { setLevel3Debrief, setLevel3SimulationData } from '../../../reducer';

export default function Level3Simulation() {
  return (
    <SimulationLevel
      level={3}
      setLevelDebrief={setLevel3Debrief}
      setLevelSimulationData={setLevel3SimulationData}
      nextStep="/post-survey"
      patientType="Challenging Patient"
      description="This is the third level of the simulation featuring a challenging patient. Here you will practice advanced skills and complete complex training exercises with a patient who may be less cooperative or have communication difficulties. This patient may be unresponsive, difficult to communicate with, or present complex health conditions, requiring advanced assessment and intervention skills."
      patientBackground="Mrs. Maria Rodriguez is a 42-year-old woman who experienced a left-sided ischemic stroke 2 months ago, resulting in severe Broca's aphasia with catastrophic reactions. She is a former office manager who is married with twin sons and previously enjoyed gardening, yoga, and volunteer work. Maria presents with extremely non-fluent, telegraphic speech characterized by severe word-finding difficulties, long pauses, excessive fillers, perseverations, and echolalia. She is highly uncooperative and emotionally volatile, often refusing to participate in therapy tasks and exhibiting catastrophic reactions when overwhelmed. It requires exceptional patience and skilled therapeutic approaches to achieve any level of cooperation."
    />
  );
}
