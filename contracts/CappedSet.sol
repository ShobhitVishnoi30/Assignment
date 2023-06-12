// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/**
 * @title CappedSet
 * @dev A contract that implements a capped set data structure with a fixed capacity.
 */
contract CappedSet {
    struct Element {
        address addr;
        uint256 value;
    }

    Element[] private heap; // The heap array to store the elements
    mapping(address => uint256) private index; // Mapping to track the index of each address
    uint256 private cap; // The maximum capacity of the set

    /**
     * @dev Initializes the CappedSet contract with the specified capacity.
     * @param _numElements The maximum number of elements the set can hold.
     */
    constructor(uint256 _numElements) {
        cap = _numElements;
        heap.push(Element(address(0), 0)); // Placeholder element at index 0
    }

    /**
     * @dev Inserts a new address-value pair into the set.
     * @param _addr The address to be inserted.
     * @param _value The corresponding value.
     * @return newLowestAddress The lowest address after the insertion.
     * @return newLowestValue The lowest value after the insertion.
     */
    function insert(address _addr, uint256 _value) external returns (address newLowestAddress, uint256 newLowestValue) {
        require(index[_addr] == 0, "Address already exists");

        if (heap.length > cap) {
            // If heap is at maximum capacity, remove the minimum value.
            remove(heap[1].addr);
        }

        // Insert the new value
        heap.push(Element(_addr, _value));
        index[_addr] = heap.length - 1;
        _shiftUp(heap.length - 1);
        return (heap[1].addr, heap[1].value);
    }

    /**
     * @dev Updates the value associated with a given address in the set.
     * @param _addr The address to be updated.
     * @param _newVal The new value to be associated with the address.
     * @return newLowestAddress The lowest address after the update.
     * @return newLowestValue The lowest value after the update.
     */
    function update(address _addr, uint256 _newVal) external returns (address newLowestAddress, uint256 newLowestValue) {
        uint256 i = index[_addr];
        require(i != 0, "Address doesn't exist");

        heap[i].value = _newVal;
        _shiftUp(i);
        _shiftDown(i);
        return (heap[1].addr, heap[1].value);
    }

    /**
     * @dev Removes an address from the set.
     * @param _addr The address to be removed.
     * @return newLowestAddress The lowest address after the removal.
     * @return newLowestValue The lowest value after the removal.
     */
    function remove(address _addr) public returns (address newLowestAddress, uint256 newLowestValue) {
        uint256 i = index[_addr];
        require(i != 0, "Address doesn't exist");
        _swap(i, heap.length - 1);
        heap.pop();
        index[_addr] = 0;
        if (i < heap.length) {
            _shiftUp(i);
            _shiftDown(i);
        }
        return (heap[1].addr, heap[1].value);
    }

    /**
     * @dev Retrieves the value associated with a given address in the set.
     * @param _addr The address for which to retrieve the value.
     * @return value The value associated with the address.
     */
    function getValue(address _addr) external view returns (uint256 value) {
        require(index[_addr] != 0, "Address doesn't exist");

        return heap[index[_addr]].value;
    }

    /**
     * @dev Retrieves the minimum address-value pair in the set.
     * @return newLowestAddress The address of the minimum element.
     * @return newLowestValue The value of the minimum element.
     */
    function getMin() external view returns (address newLowestAddress, uint256 newLowestValue) {
        require(heap.length > 1, "Heap is empty");

        Element memory min = heap[1];
        return (min.addr, min.value);
    }

    /**
     * @dev Performs the shift-up operation to maintain the heap property.
     * @param i The index of the element to be shifted up.
     */
    function _shiftUp(uint256 i) private {
        while (i > 1 && heap[i].value < heap[i / 2].value) {
            _swap(i, i / 2);
            i /= 2;
        }
    }

    /**
     * @dev Performs the shift-down operation to maintain the heap property.
     * @param i The index of the element to be shifted down.
     */
    function _shiftDown(uint256 i) private {
        while (true) {
            uint256 j = i * 2;
            if (j >= heap.length) break;
            if (j + 1 < heap.length && heap[j + 1].value < heap[j].value) {
                j++;
            }
            if (heap[i].value <= heap[j].value) break;
            _swap(i, j);
            i = j;
        }
    }

    /**
     * @dev Swaps two elements in the heap.
     * @param i The index of the first element.
     * @param j The index of the second element.
     */
    function _swap(uint256 i, uint256 j) private {
        Element memory tmp = heap[i];
        heap[i] = heap[j];
        heap[j] = tmp;
        index[heap[i].addr] = i;
        index[heap[j].addr] = j;
    }
}
