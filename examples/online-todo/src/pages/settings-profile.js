import SettingsEmailForm from "../components/settings/settings-email-form";
import SettingsPasswordForm from "../components/settings/settings-password-form";
import SettingsPhotoForm from "../components/settings/settings-photo-form";
import SettingsProfileForm from "../components/settings/settings-profile-form";

export default function SettingsProfile() {
  return (
    <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
      <SettingsProfileForm />
      <SettingsPhotoForm />
      <SettingsEmailForm />
      <SettingsPasswordForm />
    </div>
  );
}
