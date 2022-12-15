import { PlusSmIcon } from "@heroicons/react/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { authActions } from "../../redux/auth/authSlice";
import { invitationActions } from "../../redux/invitation/invitationSlice";
import Avatar from "../avatar";
import Button from "../button";
import Input from "../inputs/input";
import Modal from "./modal";

export default function AddTeamMembersModal({ show, setShow }) {
  const schema = new yup.ObjectSchema({
    email: yup.string().email().required("Email is required"),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { workspaceSlug } = useParams();
  const dispatch = useDispatch();
  const workspace = useSelector(({ workspace }) =>
    _.get(workspace.workspaceList, workspaceSlug)
  );
  const foundUsers = useSelector(({ auth }) => auth.foundUsers);
  const user = useSelector(({ auth }) => auth.user);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSug, setIsLoadingSug] = useState(false);

  useEffect(() => {
    handleSearch(watch("email"));
  }, [watch("email")]);

  const handleSearch = (searchText) => {
    if (_.size(searchText) > 2) {
      dispatch(
        authActions.searchEmailOrNameRequest({
          userId: user?._id,
          workspaceId: workspace?._id,
          searchText,
        })
      );
    }
  };

  const sendInvitation = (email) => {
    dispatch(
      invitationActions.sendInvitationRequest({
        workspaceId: workspace?._id,
        workspaceName: workspace?.name,
        email,
        onSuccess: () => {
          setIsLoading(false);
          setIsLoadingSug(false);
          setShow(false);
          toast.success("Invitation sent successfully");
        },
        onFailure: (errorList) => {
          setError("email", {
            type: "manuel",
            message: _.get(errorList, "items[0].message"),
          });
          setIsLoading(false);
          setIsLoadingSug(false);
        },
      })
    );
  };

  const sendInviteToRegisteredUser = (email) => {
    setIsLoadingSug(true);
    sendInvitation(email);
  };

  const onSubmit = ({ email }) => {
    setIsLoading(true);
    sendInvitation(email);
  };

  return (
    <Modal show={show} setShow={setShow}>
      <div className="max-w-lg mx-auto">
        <div>
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286M30 14a6 6 0 11-12 0 6 6 0 0112 0zm12 6a4 4 0 11-8 0 4 4 0 018 0zm-28 0a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <h2 className="mt-2 text-lg font-medium text-gray-900">
              Add team members
            </h2>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex">
            <div className="flex justify-between items-center">
              <div className="grow">
                <Input
                  id="email"
                  name="email"
                  placeholder="johndoe@example.com"
                  autoMargin={false}
                  register={register("email")}
                  error={errors.email}
                />
              </div>
              <Button
                type="submit"
                className="bg-indigo-500 border border-transparent rounded-md py-2.5 px-3 ml-3 flex items-center justify-center text-sm font-medium text-white hover:bg-indigo-600"
                loading={isLoading}
              >
                Send invite
              </Button>
            </div>
          </form>
        </div>
        {_.size(watch("email")) > 2 && !_.isEmpty(foundUsers) && (
          <div className="mt-10">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Suggestions
            </h3>
            <ul
              role="list"
              className="mt-4 border-t border-b border-gray-200 divide-y divide-gray-200"
            >
              {foundUsers
                .filter((person) => person._id !== user?._id)
                .map((person) => (
                  <li
                    key={person._id}
                    className="py-4 flex items-center justify-between space-x-3"
                  >
                    <div className="min-w-0 flex-1 flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <Avatar
                          size={10}
                          anotherUser={{
                            name: person.name,
                            profilePicture: person.profilePicture,
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {person.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Button
                        type="button"
                        className="inline-flex items-center py-2 px-3 border border-transparent rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        loading={isLoadingSug}
                        onClick={() => sendInviteToRegisteredUser(person.email)}
                      >
                        <PlusSmIcon
                          className="-ml-1 mr-0.5 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <span className="text-sm font-medium text-gray-900">
                          Invite <span className="sr-only">{person.name}</span>{" "}
                        </span>
                      </Button>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </Modal>
  );
}
