import { Pagination } from "@ahaui/react";
import { useNavigate } from "react-router-dom";
import { limitCategories } from "constants/pagination";

const PaginationItem = ({
  minIndex = 1,
  maxIndex = 0,
  currentIndex = minIndex,
  step = limitCategories,
  size = "medium",
}) => {
  const navigate = useNavigate();
  // Generate all parts
  const generateHeadPagination = () => (
    <>
      {currentIndex === minIndex ? (
        <Pagination.Prev disabled />
      ) : (
        <Pagination.Prev
          onClick={() => navigate(`./?page=${currentIndex - 1}`)}
        />
      )}
      {
        <Pagination.Item
          onClick={() => navigate(`./?page=${minIndex}`)}
          active={currentIndex === minIndex}
        >
          {minIndex}
        </Pagination.Item>
      }
    </>
  );

  const generateMiddlePagination = () => {
    const extendCenterIndexRange = Math.floor(step / 2);
    const _initialLower = currentIndex - extendCenterIndexRange;
    const _initialUpper = currentIndex + extendCenterIndexRange;
    const _lowerBound = minIndex + 1;
    const _upperBound = maxIndex - 1;
    const _lower = Math.max(
      _initialLower - Math.max(_initialUpper - _upperBound, 0),
      _lowerBound
    );
    const _upper = Math.min(
      _initialUpper + Math.max(_lowerBound - _initialLower, 0),
      _upperBound
    );
    const indexesArr = [];
    for (let i = _lower; i <= _upper; ++i) {
      indexesArr.push(i);
    }

    return (
      <>
        {_lower - 1 > minIndex && <Pagination.Ellipsis />}
        {indexesArr.map((index) => (
          <Pagination.Item
            onClick={() => navigate(`./?page=${index}`)}
            active={index === currentIndex}
            key={index}
          >
            {index}
          </Pagination.Item>
        ))}
        {_upper + 1 < maxIndex && <Pagination.Ellipsis />}
      </>
    );
  };

  const generateTailPagination = () => (
    <>
      {minIndex !== maxIndex && (
        <Pagination.Item
          onClick={() => navigate(`./?page=${maxIndex}`)}
          active={currentIndex === maxIndex}
        >
          {maxIndex}
        </Pagination.Item>
      )}
      {currentIndex === maxIndex ? (
        <Pagination.Next disabled />
      ) : (
        <Pagination.Next
          onClick={() => navigate(`./?page=${currentIndex + 1}`)}
        />
      )}
    </>
  );

  return (
    <Pagination sizeControl={size}>
      {generateHeadPagination()}
      {generateMiddlePagination()}
      {generateTailPagination()}
    </Pagination>
  );
};

export default PaginationItem;
