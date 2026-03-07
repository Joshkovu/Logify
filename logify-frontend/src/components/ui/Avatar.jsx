import { Root, Image, Fallback } from "@radix-ui/react-avatar";
import { cn } from "../../lib/utils";
import PropTypes from "prop-types";

function Avatar({ className, ...props }) {
  return (
    <Root
      data-slot="avatar"
      className={cn(
        "relative flex size-10 shrink-0 overflow-hidden rounded-full",
        className,
      )}
      {...props}
    />
  );
}

Avatar.propTypes = {
  className: PropTypes.string,
};

function AvatarImage({ className, ...props }) {
  return (
    <Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
}

AvatarImage.propTypes = {
  className: PropTypes.string,
};

function AvatarFallback({ className, ...props }) {
  return (
    <Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className,
      )}
      {...props}
    />
  );
}

AvatarFallback.propTypes = {
  className: PropTypes.string,
};

export { Avatar, AvatarImage, AvatarFallback };
