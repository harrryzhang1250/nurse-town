import SimulationLevel from '../../../shared/SimulationLevel';
import { setLevel2Simulation } from '../../../reducer';
import { getDebrief, submitDebrief } from '../../../shared/simulationClient';

export default function Level2Simulation() {
  return (
    <SimulationLevel
      level={2}
      setLevelSimulation={setLevel2Simulation}
      getDebrief={(userID) => getDebrief(userID, 2)}
      submitDebrief={submitDebrief}
      nextStep="/level-3-simulation"
      patientType="Cooperative Patient"
      description="This is the second level of the simulation featuring a cooperative patient. Here you will build upon your basic skills and complete intermediate training exercises with a patient who is willing and able to communicate effectively. This patient is responsive, follows instructions well, and communicates clearly, making them ideal for practicing intermediate assessment and communication skills."
    />
  );
}
