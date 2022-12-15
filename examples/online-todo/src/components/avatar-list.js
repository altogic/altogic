import _ from "lodash";
import Avatar from "./avatar";

export default function AvatarList({ users, totalSize }) {
  const members = _.take(users, 4);

  return (
    <span className="flex -space-x-2 overflow-hidden">
      {_.map(members, (user, index) => (
        <div key={`${user.userName}-${index}`}>
          <Avatar
            size={10}
            anotherUser={{
              name: user.userName,
              profilePicture: user.profilePicture,
            }}
          />
        </div>
      ))}
      {totalSize > 4 && (
        <Avatar
          size={10}
          anotherUser={{
            name: `+${totalSize}`,
          }}
        />
      )}
    </span>
  );
}
