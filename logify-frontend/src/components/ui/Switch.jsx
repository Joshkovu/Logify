import { Root, Thumb } from "@radix-ui/react-switch";
import { cn } from "../../lib/utils";
import PropTypes from "prop-types";

function Switch({ className, ...props }) {
  return (
    <Root
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-amber-600 data-[state=unchecked]:bg-black focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-card dark:data-[state=unchecked]:bg-amber-200 dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
        )}
      />
    </Root>
  );
}

Switch.propTypes = {
  className: PropTypes.string,
};

export { Switch };
