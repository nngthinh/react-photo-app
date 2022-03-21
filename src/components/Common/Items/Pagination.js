import { Pagination } from "@ahaui/react";
import { useReducer } from "react";

const PaginationItem = ({
  minIndex = 1,
  maxIndex = 20,
  currentIndex = minIndex,
  step = 5,
  size = "medium",
}) => {
  // Index state
  const [index, setIndex] = useReducer((index, action) => {
    switch (action.type) {
      case "NAVIGATE_TO":
        return action.index;
      case "NAVIGATE_NEXT":
        return index === maxIndex ? index : index + 1;
      case "NAVIGATE_BACK":
        return index === minIndex ? index : index - 1;
      default:
        return index;
    }
  }, currentIndex);

  // Common
  const extendCenterIndexRange = Math.floor(step / 2);

  // onCLick event for each Pagination Item
  const onNavigateIndex = (index) => {
    if (typeof index === "boolean") {
      setIndex({ type: `NAVIGATE_${index ? "NEXT" : "BACK"}` });
    } else {
      setIndex({ type: `NAVIGATE_TO`, index });
    }
  };

  // Generate all parts
  const generateHeadPagination = () => (
    <>
      {
        <Pagination.Prev
          onClick={() => onNavigateIndex(false)}
          disabled={index === minIndex}
        />
      }
      {
        <Pagination.Item
          onClick={() => onNavigateIndex(minIndex)}
          active={index === minIndex}
        >
          {minIndex}
        </Pagination.Item>
      }
    </>
  );

  const generateMiddlePagination = () => {
    const _initialLower = index - extendCenterIndexRange;
    const _initialUpper = index + extendCenterIndexRange;
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
        {indexesArr.map((i) => (
          <Pagination.Item
            onClick={() => onNavigateIndex(i)}
            active={i === index}
            key={i}
          >
            {i}
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
          onClick={() => onNavigateIndex(maxIndex)}
          active={index === maxIndex}
        >
          {maxIndex}
        </Pagination.Item>
      )}
      {
        <Pagination.Next
          onClick={() => onNavigateIndex(true)}
          disabled={index === maxIndex}
        />
      }
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
