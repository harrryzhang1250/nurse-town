import SimulationLevel from '../../../shared/SimulationLevel';
import { setLevel3Simulation } from '../../../reducer';
import { getDebrief, submitDebrief } from '../../../shared/simulationClient';

export default function Level3Simulation() {
  return (
    <SimulationLevel
      level={3}
      setLevelSimulation={setLevel3Simulation}
      getDebrief={(userID) => getDebrief(userID, 3)}
      submitDebrief={submitDebrief}
      nextStep="/post-survey"
      patientType="Challenging Patient"
      description="This is the third level of the simulation featuring a challenging patient. Here you will practice advanced skills and complete complex training exercises with a patient who may be less cooperative or have communication difficulties. This patient may be unresponsive, difficult to communicate with, or present complex health conditions, requiring advanced assessment and intervention skills."
    />
  );
}
