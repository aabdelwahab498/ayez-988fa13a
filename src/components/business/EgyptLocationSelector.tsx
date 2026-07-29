import { LocateFixed } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { GovernorateSelector } from "./GovernorateSelector";
import { CityAreaSelector } from "./CityAreaSelector";
import type { EgyptLocation } from "@/core/types";
import { useI18n } from "@/features/i18n/I18nProvider";

interface Props {
  value: EgyptLocation;
  onChange: (value: EgyptLocation) => void;
  showArea?: boolean;
  showCurrentLocation?: boolean;
}

/** Combined governorate + city + area picker used across search and forms. */
export function EgyptLocationSelector({
  value,
  onChange,
  showArea = true,
  showCurrentLocation = true,
}: Props) {
  const { t } = useI18n();
  return (
    <div className="space-y-3">
      <GovernorateSelector
        value={value.governorate}
        onChange={(governorate) =>
          onChange({ governorate: governorate ?? "", city: undefined, area: undefined })
        }
      />
      <CityAreaSelector
        governorate={value.governorate}
        city={value.city}
        area={value.area}
        showArea={showArea}
        onCityChange={(city) => onChange({ ...value, city, area: undefined })}
        onAreaChange={(area) => onChange({ ...value, area })}
      />
      {showCurrentLocation && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-brand"
          onClick={() =>
            toast.info(t("dir.geoDisabledTitle"), {
              description: t("dir.geoDisabledDesc"),
            })
          }
        >
          <LocateFixed className="size-4" />
          {t("dir.useCurrentLocation")}
        </Button>
      )}
    </div>
  );
}
