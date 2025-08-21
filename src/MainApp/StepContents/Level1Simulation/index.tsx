import SimulationLevel from '../../../shared/SimulationLevel';
import { setLevel1Debrief, setLevel1SimulationData } from '../../../reducer';

export default function Level1Simulation() {
  return (
    <SimulationLevel
      level={1}
      setLevelDebrief={setLevel1Debrief}
      setLevelSimulationData={setLevel1SimulationData}
      nextStep="/level-2-simulation"
      patientType="Cooperative Patient"
      description="This is the first level of the simulation featuring a cooperative patient. Here you will learn the basic concepts and complete initial training exercises with a patient who is willing and able to communicate effectively. This patient is responsive, follows instructions well, and communicates clearly, making them ideal for learning basic assessment and communication skills."
      patientBackground="Mrs. Karen Harris is a 65-year-old woman who experienced a left-sided ischemic stroke 3 months ago, resulting in mild Broca's aphasia. She is a former part-time accountant who is married with two adult children and previously enjoyed golf, baseball, and crossword puzzles. Karen presents with non-fluent, telegraphic speech characterized by omitted function words, word-finding difficulties, and occasional pauses and fillers. She is generally cooperative and highly motivated to return to work, though she occasionally becomes frustrated or embarrassed when unable to find words or when facing complex instructions. Karen responds well to encouragement, visual cues, repetition, and clear simple instructions, and benefits from a patient, supportive therapeutic approach that acknowledges her efforts and relates tasks to her goal of returning to work."
    />
  );
}
