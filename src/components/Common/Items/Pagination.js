import { Pagination } from "@ahaui/react";
import { useSearchParams } from "react-router-dom";

const PaginationItem = ({
  minIndex = 1,
  maxIndex = 0,
  currentIndex = minIndex,
  step = 5,
  size = "small",
} = {}) => {
  const isValid = maxIndex >= minIndex;
  const [, setSearchParams] = useSearchParams();

  // Generate all parts
  const generateHeadPagination = () => (
    <>
      {!isValid || currentIndex <= minIndex ? (
        <Pagination.Prev disabled />
      ) : (
        <Pagination.Prev
          onClick={() => setSearchParams({ page: currentIndex - 1 })}
        />
      )}
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
      isValid && (
        <>
          {
            <Pagination.Item
              onClick={() => setSearchParams({ page: minIndex })}
              active={currentIndex === minIndex}
              data-testid={`${minIndex}-tail`}
            >
              {minIndex}
            </Pagination.Item>
          }
          {_lower - 1 > minIndex && <Pagination.Ellipsis />}
          {indexesArr.map((index) => (
            <Pagination.Item
              onClick={() => setSearchParams({ page: index })}
              active={index === currentIndex}
              key={index}
              data-testid={`${index}-middle`}
            >
              {index}
            </Pagination.Item>
          ))}
          {_upper + 1 < maxIndex && <Pagination.Ellipsis />}
          {minIndex !== maxIndex && (
            <Pagination.Item
              onClick={() => setSearchParams({ page: maxIndex })}
              active={currentIndex === maxIndex}
              data-testid={`${maxIndex}-tail`}
            >
              {maxIndex}
            </Pagination.Item>
          )}
        </>
      )
    );
  };

  const generateTailPagination = () => (
    <>
      {!isValid || currentIndex >= maxIndex ? (
        <Pagination.Next disabled />
      ) : (
        <Pagination.Next
          onClick={() => setSearchParams({ page: currentIndex + 1 })}
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
