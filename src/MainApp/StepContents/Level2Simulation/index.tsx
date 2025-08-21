import SimulationLevel from '../../../shared/SimulationLevel';
import { setLevel2Debrief, setLevel2SimulationData } from '../../../reducer';

export default function Level2Simulation() {
  return (
    <SimulationLevel
      level={2}
      setLevelDebrief={setLevel2Debrief}
      setLevelSimulationData={setLevel2SimulationData}
      nextStep="/level-3-simulation"
      patientType="Cooperative Patient"
      description="This is the second level of the simulation featuring a cooperative patient. Here you will build upon your basic skills and complete intermediate training exercises with a patient who is willing and able to communicate effectively. This patient is responsive, follows instructions well, and communicates clearly, making them ideal for practicing intermediate assessment and communication skills."
      patientBackground="Mrs. Sarah Thompson is a 38-year-old woman who experienced a left-sided ischemic stroke 3 months ago, resulting in severe Broca's aphasia. She is a former high school English teacher who is married with one teenage daughter and previously enjoyed reading, theater, and cooking. Sarah presents with extremely non-fluent, telegraphic speech characterized by significant word-finding difficulties, frequent pauses, fillers, and perseverations. She initially cooperates with therapy tasks but becomes anxious and frustrated after her first attempt, requiring encouragement and scaffolding to continue participating in therapeutic activities."
    />
  );
}
