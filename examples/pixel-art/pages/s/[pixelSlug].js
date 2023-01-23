import { yupResolver } from "@hookform/resolvers/yup";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import * as yup from "yup";
import Avatar from "../../components/avatar";
import Button from "../../components/button";
import Container from "../../components/container";
import Input from "../../components/input";
import ListObserver from "../../components/list-observer";
import DeleteModal from "../../components/modals/delete-modal";
import Navbar from "../../components/navbar";
import { pixelActions } from "../../redux/pixel/pixelSlice";
import useArraySelector from "../../functions/hooks/useArraySelector";
import MyHead from "../../components/my-head";

export default function PixelSettings() {
  const schema = new yup.ObjectSchema({
    name: yup
      .string()
      .required("Title is required ")
      .trim()
      .min(3, "title must be at least 3 characters")
      .max(40, "Title must be at most 40 characters"),
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
  const router = useRouter();
  const { pixelSlug } = router.query;

  const user = useSelector((state) => state.auth.user);
  const pixelConnection = useSelector((state) =>
    _.get(state.pixel.pixelConnections, pixelSlug)
  );
  const memberList = useArraySelector(({ pixel }) => pixel.pixelDrawers);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deletedMember, setDeletedMember] = useState(null);
  const [deletedArt, setDeletedArt] = useState(false);

  useEffect(() => {
    if (pixelSlug) {
      dispatch(
        pixelActions.getConnectionBySlugRequest({
          userId: user?._id,
          slug: pixelSlug,
          onSuccess: (isOwner) => {
            if (!isOwner) router.push("/");
          },
          onFailure: () => {
            router.push("/");
          },
        })
      );
    }
  }, [pixelSlug]);

  useEffect(() => {
    if (pixelConnection) {
      setValue("name", pixelConnection?.pixelName);
    }
  }, [pixelConnection]);

  useEffect(() => {
    if (pixelSlug) {
      getMemberList("", true);
    }
  }, [pixelSlug]);

  useEffect(() => {
    return () => {
      dispatch(pixelActions.setPixelDrawersInfo(null));
    };
  }, []);

  const getMemberList = (searchText, isNewSearch = false, debounce = false) => {
    if (debounce) {
      dispatch(
        pixelActions.getPixelDrawersSearchRequest({
          pixelSlug,
          searchText: searchText.trim(),
          isNewSearch: true,
        })
      );
    } else {
      dispatch(
        pixelActions.getPixelDrawersRequest({
          pixelSlug,
          searchText: searchText || isNewSearch ? searchText.trim() : null,
          isNewSearch,
        })
      );
    }
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchText(value);

    if (_.size(value) === 0) {
      getMemberList("", true, true);
    } else {
      getMemberList(searchText, true, true);
    }
  };

  const onSubmit = ({ name }) => {
    setIsLoading(true);
    dispatch(
      pixelActions.updatePixelNameRequest({
        pixelId: pixelConnection?.pixelArt._id,
        pixelSlug,
        name,
        onSuccess: () => {
          setIsLoading(false);
          toast.success("Pixel name updated successfully");
        },
        onFailure: (errorList) => {
          setError("name", {
            type: "manuel",
            message: _.get(errorList, "items[0].message"),
          });
          setIsLoading(false);
        },
      })
    );
  };
  const deleteArt = () => {
    dispatch(
      pixelActions.removePixelArtRequest({
        pixelId: pixelConnection?.pixelArt._id,
        pixelSlug,
        onSuccess: () => {
          router.push("/");
        },
        onFailure: (errorList) => {
          toast.error(_.get(errorList, "items[0].message"));
        },
      })
    );
  };

  const removeTeam = () => {
    dispatch(pixelActions.deleteMemberRequest(deletedMember));
  };

  return (
    <>
      <MyHead />
      <Navbar />
      <Container className="my-12">
        <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="bg-gray-100 py-6 px-4 space-y-6 sm:p-6">
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
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-100 text-right sm:px-6">
                <Button
                  type="submit"
                  className="bg-violet-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                  loading={isLoading}
                >
                  Save
                </Button>
              </div>
            </div>
          </form>
          <div className="shadow sm:rounded-md sm:overflow-hidden">
            <div className="bg-gray-100 py-6 px-4 space-y-6 sm:p-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Remove Pixel Table
                </h3>
              </div>

              <div className="flex justify-center">
                <Button
                  className="bg-red-600 border w-4/12 border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-md font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  onClick={() => setDeletedArt(true)}
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>{" "}
          {(!_.isEmpty(searchText) ||
            pixelConnection?.pixelArt.drawerSize > 1) && (
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
                          MEMBERS ({pixelConnection?.pixelArt.drawerSize})
                        </span>
                      </th>
                      <th className="py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Operation
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-100 divide-y divide-gray-100">
                    {_.map(memberList, (member) => (
                      <tr
                        className="group group-hover:bg-gray-50"
                        key={member._id}
                      >
                        <td className="relative px-6 py-5 flex items-center space-x-3 focus-within:ring-2 focus-within:ring-inset focus-within:ring-violet-500">
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
                        <td className="py-3 text-sm text-gray-500 font-medium">
                          {member._id !== user?._id && (
                            <Button
                              className="bg-red-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              onClick={() =>
                                setDeletedMember({
                                  pixelSlug,
                                  pixelId: pixelConnection.pixelArt._id,
                                  memberId: member._id,
                                })
                              }
                            >
                              Remove
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ListObserver>
            </>
          )}
          {deletedArt && (
            <DeleteModal
              title="Delete Art"
              description="Are you sure you would like to delete art forever?"
              setDeleteModal={() => setDeletedArt(false)}
              clickDelete={deleteArt}
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
