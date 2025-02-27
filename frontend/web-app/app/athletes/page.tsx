import AddWorkout from "./AddWorkout";
import ConnectDevice from "./ConnectDevice";
import CustomDashboard from "./CustomDashboard";
import DefaultDashboard from "./DefaultDashboard";
import Performance from "./Performance";
import TrainingPlans from "./TrainingPlans";

export default function AthletesHome() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* <Headers /> */}
      <div className="container mx-auto py-8 grid grid-cols-3 gap-4">
        {/* Column 1 */}
        <div className="space-y-4">
          <Performance />
          <TrainingPlans />
        </div>

        {/* Column 2 */}
        <div className="space-y-4">
          <ConnectDevice />
          <AddWorkout />
        </div>

        {/* Column 3 */}
        <div className="space-y-4">
          <DefaultDashboard />
          <CustomDashboard />
        </div>
      </div>
    </div>
  );
}
