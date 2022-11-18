import { IonItem } from "@ionic/react";

const IndexView: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-4 h-screen">
      <IonItem
        className="px-4 py-2 font-medium text-xl"
        routerLink="/magic-link"
      >
        Login With Magic Link
      </IonItem>
      <IonItem className="px-4 py-2 font-medium text-xl" routerLink="/sign-in">
        Sign In
      </IonItem>
      <IonItem className="px-4 py-2 font-medium text-xl" routerLink="/sign-up">
        Sign Up
      </IonItem>
    </div>
  );
};

export default IndexView;
