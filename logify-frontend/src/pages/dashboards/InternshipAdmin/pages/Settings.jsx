import { Button } from "../../../../components/ui/Button";
import { Switch } from "../../../../components/ui/Switch";
import { Input } from "../../../../components/ui/Input";

const Settings = () => {
  return (
    <div className="min-h-screen w-full bg-[#FCFBF8] px-10 py-8  font-sans">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-maroon mb-2 tracking-tight">
          System Settings
        </h1>
        <p className="text-lg text-text-secondary">
          Configure system-wide settings and preferences
        </p>
      </header>

      <section className="mb-8 bg-white rounded-[12px] border border-border hover:scale-102 transition-all p-8">
        <h2 className="text-2xl font-bold text-maroon mb-2">
          General Settings
        </h2>
        <p className="text-text-secondary mb-6">
          Manage system-wide preferences and configurations
        </p>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-base font-semibold text-text-secondary mb-2">
              System Name
            </h3>
            <Input id="systemName" value="Logify ILES" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-text-secondary mb-2">
              Admin Contact
            </h3>
            <Input
              id="adminContact"
              placeholder="Enter admin contact information"
            />
          </div>
        </div>
      </section>

      <section className="mb-8 bg-white rounded-[12px] border border-border hover:scale-102 transition-all p-8">
        <h2 className="text-2xl font-bold text-maroon mb-2">
          Notification Settings
        </h2>
        <p className="text-text-secondary mb-6">
          Configure email and system notifications
        </p>
        {/* Placeholder for notification settings */}
        <div className="flex justify-between gap-8 mb-6">
          <div>
            <h3 className="text-base font-semibold text-text-secondary mb-2">
              Email Notifications
            </h3>
            <p className="text-sm text-text-secondary mb-2">
              Send email notifications for important events
            </p>
          </div>
          <div>
            {" "}
            <Switch defaultChecked />
          </div>
        </div>
        <div className="flex justify-between gap-8">
          <div>
            <h3 className="text-base font-semibold text-text-secondary mb-2">
              Supervisor Reminders
            </h3>
            <p className="text-sm text-text-secondary mb-2">
              Remind supervisors about pending reviews
            </p>
          </div>
          <div>
            {" "}
            <Switch defaultChecked />
          </div>
        </div>
      </section>

      <section className="mb-8 bg-white rounded-[12px] border border-border hover:scale-102 transition-all p-8">
        <h2 className="text-2xl font-bold text-maroon mb-2">
          Evaluation Settings
        </h2>
        <p className="text-text-secondary mb-6">
          Configure evaluation parameters
        </p>
        <div className="mb-6">
          <h3 className="text-base font-semibold text-text-secondary mb-2">
            Minimum passing score
          </h3>
          <input
            type="text"
            placeholder="60"
            className="w-40 border border-border rounded-lg px-4 py-2 bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div className="flex justify-between gap-8">
          <div className="">
            <h3 className="text-base font-semibold text-text-secondary mb-2">
              Evaluation Types
            </h3>
            <p className="text-sm text-text-secondary mb-2">
              Define types of evaluations used in the system
            </p>
          </div>
          <div className="">
            {" "}
            <Switch />
          </div>
        </div>
      </section>
      <div className="flex justify-end gap-3">
        <Button variant="outline">Reset to Defaults</Button>
        <Button className="bg-maroonCustom hover:bg-maroon-dark text-white">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Settings;
