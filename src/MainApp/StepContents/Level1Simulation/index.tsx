import SimulationLevel from '../../../shared/SimulationLevel';
import { selectLevel1SimulationData, setLevel1Debrief, setLevel1SimulationData } from '../../../reducer';

export default function Level1Simulation() {
  return (
    <SimulationLevel
      level={1}
      setLevelDebrief={setLevel1Debrief}
      setLevelSimulationData={setLevel1SimulationData}
      selectSimulationData={selectLevel1SimulationData}
      nextStep="/level-2-simulation"
      patientType="Cooperative Patient"
      description="This is the first level of the simulation featuring a cooperative patient. Here you will learn the basic concepts and complete initial training exercises with a patient who is willing and able to communicate effectively. This patient is responsive, follows instructions well, and communicates clearly, making them ideal for learning basic assessment and communication skills."
    />
  );
}
