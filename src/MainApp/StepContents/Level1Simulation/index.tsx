import SimulationLevel from '../../../shared/SimulationLevel';
import { setLevel1Simulation } from '../../../reducer';
import { getDebrief, submitDebrief } from '../../../shared/simulationClient';

export default function Level1Simulation() {
  return (
    <SimulationLevel
      level={1}
      setLevelSimulation={setLevel1Simulation}
      getDebrief={(userID) => getDebrief(userID, 1)}
      submitDebrief={submitDebrief}
      nextStep="/level-2-simulation"
      patientType="Cooperative Patient"
      description="This is the first level of the simulation featuring a cooperative patient. Here you will learn the basic concepts and complete initial training exercises with a patient who is willing and able to communicate effectively. This patient is responsive, follows instructions well, and communicates clearly, making them ideal for learning basic assessment and communication skills."
    />
  );
}
