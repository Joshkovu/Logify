import { Button } from "../../../../components/ui/Button";
import { Switch } from "../../../../components/ui/Switch";
import { Input } from "../../../../components/ui/Input";

const Settings = () => {
  return (
    <div className="min-h-screen w-full bg-[#FCFBF8] transition-colors duration-300 dark:bg-slate-950 px-4 py-6 font-sans sm:px-6 sm:py-8 lg:px-10 xl:px-12">
      <header className="mb-8">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-maroon dark:text-gold sm:text-4xl">
          System Settings
        </h1>
        <p className="text-sm text-text-secondary dark:text-slate-300 sm:text-base lg:text-lg">
          Configure system-wide settings and preferences
        </p>
      </header>

      <section className="mb-8 rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-5 transition-all hover:scale-102 sm:p-6 lg:p-8">
        <h2 className="text-2xl font-bold text-maroon dark:text-gold mb-2">
          General Settings
        </h2>
        <p className="text-text-secondary dark:text-slate-300 mb-6">
          Manage system-wide preferences and configurations
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          <div>
            <h3 className="text-base font-semibold text-text-secondary dark:text-slate-300 mb-2">
              System Name
            </h3>
            <Input id="systemName" value="Logify ILES" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-text-secondary dark:text-slate-300 mb-2">
              Admin Contact
            </h3>
            <Input
              id="adminContact"
              placeholder="Enter admin contact information"
            />
          </div>
        </div>
      </section>

      <section className="mb-8 rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-5 transition-all hover:scale-102 sm:p-6 lg:p-8">
        <h2 className="text-2xl font-bold text-maroon dark:text-gold mb-2">
          Notification Settings
        </h2>
        <p className="text-text-secondary dark:text-slate-300 mb-6">
          Configure email and system notifications
        </p>
        {/* Placeholder for notification settings */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
          <div>
            <h3 className="text-base font-semibold text-text-secondary dark:text-slate-300 mb-2">
              Email Notifications
            </h3>
            <p className="text-sm text-text-secondary dark:text-slate-300 mb-2">
              Send email notifications for important events
            </p>
          </div>
          <div>
            {" "}
            <Switch defaultChecked />
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
          <div>
            <h3 className="text-base font-semibold text-text-secondary dark:text-slate-300 mb-2">
              Supervisor Reminders
            </h3>
            <p className="text-sm text-text-secondary dark:text-slate-300 mb-2">
              Remind supervisors about pending reviews
            </p>
          </div>
          <div>
            {" "}
            <Switch defaultChecked />
          </div>
        </div>
      </section>

      <section className="mb-8 rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-5 transition-all hover:scale-102 sm:p-6 lg:p-8">
        <h2 className="text-2xl font-bold text-maroon dark:text-gold mb-2">
          Evaluation Settings
        </h2>
        <p className="text-text-secondary dark:text-slate-300 mb-6">
          Configure evaluation parameters
        </p>
        <div className="mb-6">
          <h3 className="text-base font-semibold text-text-secondary dark:text-slate-300 mb-2">
            Minimum passing score
          </h3>
          <input
            type="text"
            placeholder="60"
            className="w-40 border border-border dark:border-slate-700 rounded-lg px-4 py-2 bg-background dark:bg-slate-800 text-text-primary dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
          <div className="">
            <h3 className="text-base font-semibold text-text-secondary dark:text-slate-300 mb-2">
              Evaluation Types
            </h3>
            <p className="text-sm text-text-secondary dark:text-slate-300 mb-2">
              Define types of evaluations used in the system
            </p>
          </div>
          <div className="">
            {" "}
            <Switch />
          </div>
        </div>
      </section>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button variant="outline">Reset to Defaults</Button>
        <Button className="bg-maroonCustom hover:bg-maroon-dark text-white">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Settings;
