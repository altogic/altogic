import { yupResolver } from "@hookform/resolvers/yup";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import Avatar from "../components/avatar";
import Button from "../components/button";
import Container from "../components/container";
import Input from "../components/inputs/input";
import ListObserver from "../components/list-observer";
import DeleteModal from "../components/modals/delete-modal";
import Navbar from "../components/navbar";
import functions from "../helpers/functions";
import { myRouter } from "../helpers/routes";
import useArraySelector from "../helpers/useArraySelector";
import { workspaceActions } from "../redux/workspace/workspaceSlice";

export default function SettingsWorkspace() {
  const schema = new yup.ObjectSchema({
    name: yup
      .string()
      .required("Title is required ")
      .trim()
      .min(3, "title must be at least 3 characters")
      .max(40, "Title must be at most 40 characters"),
    description: yup
      .string()
      .trim()
      .max(180, "Description must be at most 180 characters"),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { workspaceSlug } = useParams("workspaceSlug");

  const user = useSelector(({ auth }) => auth.user);
  const workspace = useSelector(({ workspace }) =>
    _.get(workspace.workspaces, workspaceSlug)
  );
  const memberList = useArraySelector(({ workspace }) => workspace.members);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deletedMember, setDeletedMember] = useState(null);
  const [deletedWorkspace, setDeletedWorkspace] = useState(false);

  useEffect(() => {
    if (workspaceSlug) {
      dispatch(
        workspaceActions.getWorkspaceBySlugRequest({
          userId: user?._id,
          slug: workspaceSlug,
          onSuccess: (isOwner) => {
            if (!isOwner) {
              navigate("/");
            }
          },
          onFailure: () => {
            navigate("/");
          },
        })
      );
    }
  }, [workspaceSlug]);

  useEffect(() => {
    if (workspace) {
      setValue("name", workspace?.workspaceName);
      setValue("description", workspace?.workspace.description || "");
    }
  }, [workspace]);

  useEffect(() => {
    getMemberList("", true);
  }, []);

  useEffect(() => {
    return () => {
      dispatch(workspaceActions.setMemberInfo(null));
    };
  }, []);

  const getMemberList = (searchText, isNewSearch = false) => {
    dispatch(
      workspaceActions.getWorkspaceMembersRequest({
        workspaceSlug,
        searchText: searchText || isNewSearch ? searchText.trim() : null,
        isNewSearch,
      })
    );
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchText(_.trim(value));

    if (_.size(value) > 2) {
      _.debounce(() => {
        getMemberList(value, true);
      }, 500)();
    } else if (_.size(value) === 0) {
      getMemberList("", true);
    }
  };

  const onSubmit = ({ name, description }) => {
    setIsLoading(true);
    const updatedWorkspace = {
      workspaceId: workspace?.workspace._id,
      name,
      description,
      slug:
        workspace?.workspaceName === name
          ? workspace?.workspaceSlug
          : functions.createSlug(name, workspace?.workspace.index),
    };
    dispatch(
      workspaceActions.updateWorkspaceRequest({
        slug: workspace?.workspaceSlug,
        body: updatedWorkspace,
        onSuccess: (slugChanged, newSlug) => {
          if (slugChanged) navigate(myRouter.SETTINGS_WORKSPACE(newSlug));
          setIsLoading(false);
          toast.success("Workspace updated successfully");
        },
        onFailure: (errorList) => {
          _.forEach(errorList.items, (err) => {
            switch (err?.details?.field) {
              case "name":
                setError("name", {
                  type: "manuel",
                  message: err?.message,
                });
                break;
              case "description":
                setError("description", {
                  type: "manuel",
                  message: err?.message,
                });
                break;
              case "isPublic":
                setError("isPublic", {
                  type: "manuel",
                  message: err?.message,
                });
                break;

              default:
                setError("name", {
                  type: "manuel",
                  message: err?.message,
                });
                break;
            }
          });
          setIsLoading(false);
        },
      })
    );
  };
  const deleteWorkspace = () => {
    dispatch(
      workspaceActions.deleteWorkspaceRequest({
        workspaceId: workspace?.workspace._id,
        workspaceSlug: workspace?.workspaceSlug,
        onSuccess: () => {
          navigate("/");
        },
        onFailure: (errorList) => {
          toast.error(_.get(errorList, "items[0].message"));
        },
      })
    );
  };

  const removeTeam = () => {
    dispatch(workspaceActions.deleteMemberRequest(deletedMember));
  };

  return (
    <>
      <Navbar />
      <Container className="my-12">
        <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <Input
                      label="Name"
                      id="name"
                      name="name"
                      placeholder="Business"
                      register={register("name")}
                      error={errors.name}
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <Input
                      label="Description"
                      id="description"
                      name="description"
                      placeholder="This is business workspace."
                      textArea
                      register={register("description")}
                      error={errors.description}
                    />
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <Button
                  type="submit"
                  className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  loading={isLoading}
                >
                  Save
                </Button>
              </div>
            </div>
          </form>
          <div className="shadow sm:rounded-md sm:overflow-hidden">
            <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Delete Workspace
                </h3>
              </div>

              <div className="flex justify-center">
                <Button
                  className="bg-red-600 border w-4/12 border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-md font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  onClick={() => setDeletedWorkspace(true)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>{" "}
          {_.size(memberList) > 1 && (
            <>
              <div className="mt-6 flex justify-between items-center">
                <div className="grow">
                  <Input
                    autoMargin={false}
                    placeholder="Search Members"
                    onChange={handleSearch}
                    value={searchText}
                  />
                </div>
              </div>
              <ListObserver onEnd={getMemberList}>
                <table className="min-w-full">
                  <thead>
                    <tr className="border-t border-gray-200">
                      <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <span className="lg:pl-2">
                          MEMBERS ({workspace?.workspace.userSize})
                        </span>
                      </th>
                      <th className="py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Operation
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {_.map(memberList, (member) => (
                      <tr
                        className="group group-hover:bg-gray-50"
                        key={member._id}
                      >
                        <td className="relative px-6 py-5 flex items-center space-x-3 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                          <div className="flex-shrink-0">
                            <Avatar
                              size={10}
                              anotherUser={{
                                name: member.name,
                                profilePicture: member.profilePicture,
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span
                              className="absolute inset-0"
                              aria-hidden="true"
                            />
                            <p className="text-sm font-medium text-gray-900">
                              {member.name}
                            </p>
                          </div>
                        </td>
                        {member._id !== user?._id && (
                          <td className="py-3 text-sm text-gray-500 font-medium">
                            <Button
                              className="bg-red-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              onClick={() =>
                                setDeletedMember({
                                  workspaceSlug: workspace?.workspace.slug,
                                  workspaceId: workspace?.workspace._id,
                                  memberId: member._id,
                                })
                              }
                            >
                              Remove
                            </Button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ListObserver>
            </>
          )}
          {deletedWorkspace && (
            <DeleteModal
              title="Delete Workspace"
              description="Are you sure you would like to delete workspace forever?"
              setDeleteModal={() => setDeletedWorkspace(false)}
              clickDelete={deleteWorkspace}
            />
          )}
          {deletedMember && (
            <DeleteModal
              title="Remove Team"
              description="Are you sure you would like to remove this team?"
              setDeleteModal={() => setDeletedMember(null)}
              clickDelete={removeTeam}
            />
          )}
        </div>
      </Container>
    </>
  );
}
