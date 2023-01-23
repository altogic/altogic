import _ from "lodash";
import { ClipLoader } from "react-spinners";
import ArtCard from "./art-card";
import Button from "./button";
import Empty from "./empty";
import Input from "./input";
import ListObserver from "./list-observer";

export default function ArtList(props) {
  const {
    title,
    createButton,
    handleSearch,
    searchText,
    list,
    loading,
    getList,
  } = props;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
          {title}
        </h2>
        {createButton && (
          <Button
            className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700"
            onClick={createButton}
          >
            Create
          </Button>
        )}
        {handleSearch && (
          <Input
            autoMargin={false}
            placeholder="Search"
            onChange={handleSearch}
            value={searchText}
          />
        )}
      </div>
      {_.isEmpty(list) ? (
        loading ? (
          <div className="items-center flex flex-col mt-12">
            <ClipLoader color="violet" loading={loading} size={120} />
          </div>
        ) : (
          <Empty
            message={
              _.isEmpty(searchText) ? "There are no arts" : "Results not found"
            }
          />
        )
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          <ListObserver onEnd={getList}>
            {_.map(list, (pixel) => (
              <div key={pixel?.slug}>
                <ArtCard pixel={pixel} />
              </div>
            ))}
          </ListObserver>
        </div>
      )}
    </div>
  );
}
