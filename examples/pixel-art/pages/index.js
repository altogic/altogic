import _ from "lodash";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ArtList from "../components/art-list";
import Container from "../components/container";
import NewPixelModal from "../components/modals/new-pixel-modal";
import MyHead from "../components/my-head";
import Navbar from "../components/navbar";
import useArraySelector from "../functions/hooks/useArraySelector";
import { pixelActions } from "../redux/pixel/pixelSlice";

export default function Home() {
  const dispatch = useDispatch();
  const globalPixelList = useArraySelector(({ pixel }) => pixel.globalPixels);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);

  useEffect(() => {
    getGlobalPixels("", true);
  }, []);

  useEffect(() => {
    return () => {
      dispatch(pixelActions.setInfo(null));
    };
  }, []);

  const getGlobalPixels = (
    searchText,
    isNewSearch = false,
    debounce = false
  ) => {
    if (isNewSearch) {
      setLoading(true);
    }
    if (debounce) {
      dispatch(
        pixelActions.getGlobalPixelsSearchRequest({
          searchText: searchText.trim(),
          isNewSearch: true,
          onSuccess: () => {
            setLoading(false);
          },
          onFailure: () => {
            setLoading(false);
          },
        })
      );
    } else {
      dispatch(
        pixelActions.getGlobalPixelsRequest({
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

    if (_.size(value) === 0) {
      getGlobalPixels("", true, true);
    } else {
      getGlobalPixels(searchText, true, true);
    }
  };

  return (
    <>
      <MyHead />
      <Navbar newArt={() => setShowNewModal(true)} />
      <Container>
        <ArtList
          title="All Arts"
          handleSearch={handleSearch}
          searchText={searchText}
          list={globalPixelList}
          loading={loading}
          getList={getGlobalPixels}
        />
        <NewPixelModal show={showNewModal} setShow={setShowNewModal} />
      </Container>
    </>
  );
}
