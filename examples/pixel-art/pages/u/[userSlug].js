import _ from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ArtList from "../../components/art-list";
import Container from "../../components/container";
import NewPixelModal from "../../components/modals/new-pixel-modal";
import MyHead from "../../components/my-head";
import Navbar from "../../components/navbar";
import useArraySelector from "../../functions/hooks/useArraySelector";
import { pixelActions } from "../../redux/pixel/pixelSlice";

export default function UserArts() {
  const router = useRouter();
  const { userSlug } = router.query;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const userArts = useArraySelector(({ pixel }) => pixel.userArts);
  const me = user?.slug === userSlug;
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const sortedUserArts = _(userArts).orderBy(["updatedAt"], ["desc"]).valueOf();

  useEffect(() => {
    if (user) getUserArts("", true);
  }, [user]);

  useEffect(() => {
    return () => {
      dispatch(pixelActions.setUserArtsInfo(null));
    };
  }, []);

  const getUserArts = (searchText, isNewSearch = false, debounce = false) => {
    if (isNewSearch) {
      setLoading(true);
    }
    if (debounce) {
      // dispatch(
      //   pixelActions.getGlobalPixelsSearchRequest({
      //     searchText: searchText.trim(),
      //     isNewSearch: true,
      //     onSuccess: () => {
      //       setLoading(false);
      //     },
      //     onFailure: () => {
      //       setLoading(false);
      //     },
      //   })
      // );
    } else {
      dispatch(
        pixelActions.getUserArtsRequest({
          userSlug,
          searchText: searchText || isNewSearch ? searchText.trim() : null,
          isNewSearch,
          onSuccess: () => {
            setLoading(false);
          },
          onFailure: () => {
            setLoading(false);
          },
        })
      );
    }
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchText(value);

    if (_.size(value) > 2) {
      getUserArts(searchText, true, true);
    } else if (_.size(value) === 0) {
      getUserArts("", true, true);
    }
  };

  return (
    <>
      <MyHead />
      <Navbar />
      <Container>
        <ArtList
          title={me ? user?.name : _.get(userArts, "[0].userName")}
          list={sortedUserArts}
          loading={loading}
          getList={getUserArts}
          createButton={me ? () => setShowNewModal(true) : null}
        />
      </Container>
      <NewPixelModal show={showNewModal} setShow={setShowNewModal} />
    </>
  );
}
