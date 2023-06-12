import hre, { ethers, waffle } from "hardhat";
import { Contract, ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";

describe("CappedSet", () => {
  let CappedSet: ContractFactory;
  let cappedSet: Contract;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addr3: SignerWithAddress;

  // Deploy the contract before each test case
  beforeEach(async () => {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    const CappedSetContract = await ethers.getContractFactory("CappedSet");
    cappedSet = await CappedSetContract.deploy(3);
    await cappedSet.deployed();
  });

  describe("insert", () => {
    it("should insert a new element and return the lowest address and value", async () => {
      await cappedSet.insert(addr1.address, 100);
      await cappedSet.insert(addr2.address, 200);
      await cappedSet.insert(addr3.address, 300);

      const [lowestAddress, lowestValue] = await cappedSet.getMin();
      expect(lowestAddress).to.equal(addr1.address);
      expect(lowestValue).to.equal(100);
    });

    it("should not insert an existing element", async () => {
      await cappedSet.insert(addr1.address, 100);

      await expect(cappedSet.insert(addr1.address, 200)).to.be.revertedWith(
        "Address already exists"
      );
    });
  });

  describe("update", () => {
    it("should update an existing element and return the lowest address and value", async () => {
      await cappedSet.insert(addr1.address, 100);
      await cappedSet.insert(addr2.address, 200);
      await cappedSet.insert(addr3.address, 300);

      let [lowestAddress, lowestValue] = await cappedSet.getMin();
      expect(lowestAddress).to.equal(addr1.address);
      expect(lowestValue).to.equal(100);

      await cappedSet.update(addr1.address, 50);

      [lowestAddress, lowestValue] = await cappedSet.getMin();
      expect(lowestAddress).to.equal(addr1.address);
      expect(lowestValue).to.equal(50);
    });

    it("should not update a non-existing element", async () => {
      await expect(cappedSet.update(addr1.address, 50)).to.be.revertedWith(
        "Address doesn't exist"
      );
    });
  });

  describe("remove", () => {
    it("should remove an element and return the new lowest address and value", async () => {
      await cappedSet.insert(addr1.address, 100);
      await cappedSet.insert(addr2.address, 200);
      await cappedSet.insert(addr3.address, 300);

      let [lowestAddress, lowestValue] = await cappedSet.getMin();
      expect(lowestAddress).to.equal(addr1.address);
      expect(lowestValue).to.equal(100);

      await cappedSet.remove(addr1.address);

      [lowestAddress, lowestValue] = await cappedSet.getMin();
      expect(lowestAddress).to.equal(addr2.address);
      expect(lowestValue).to.equal(200);
    });

    it("should not remove a non-existing element", async () => {
      await expect(cappedSet.remove(addr1.address)).to.be.revertedWith(
        "Address doesn't exist"
      );
    });
  });

  describe("getValue", () => {
    it("should retrieve the value associated with an address", async () => {
      await cappedSet.insert(addr1.address, 100);

      const value = await cappedSet.getValue(addr1.address);
      expect(value).to.equal(100);
    });

    it("should not retrieve the value for a non-existing address", async () => {
      await expect(cappedSet.getValue(addr1.address)).to.be.revertedWith(
        "Address doesn't exist"
      );
    });
  });

  describe("getMin", () => {
    it("should revert if heap is empty", async () => {
      // Call getMin when heap is empty
      await expect(cappedSet.getMin()).to.be.revertedWith("Heap is empty");
    });

    it("should return the minimum address-value pair in the set", async () => {
      // Insert elements into the set
      await cappedSet.insert(addr1.address, 200);
      await cappedSet.insert(addr2.address, 100);
      await cappedSet.insert(addr3.address, 300);

      // Call getMin() to retrieve the minimum address-value pair
      const [lowestAddress, lowestValue] = await cappedSet.getMin();

      // Verify the returned values
      expect(lowestAddress).to.equal(addr2.address);
      expect(lowestValue).to.equal(100);
    });
  });

  describe("CappedSet with maximum capacity", () => {
    it("should handle maximum capacity and remove the minimum value when inserting new elements", async () => {
      // Insert elements up to the maximum capacity
      await cappedSet.insert(addr1.address, 100);
      await cappedSet.insert(addr2.address, 200);
      await cappedSet.insert(addr3.address, 300);

      // Insert a new element, which should remove the minimum value (100)
      await cappedSet.insert(owner.address, 50);

      const [lowestAddress, lowestValue] = await cappedSet.getMin();
      expect(lowestAddress).to.equal(owner.address);
      expect(lowestValue).to.equal(50);
    });

    it("should handle maximum capacity and maintain the minimum value when updating existing elements", async () => {
      // Insert elements up to the maximum capacity
      await cappedSet.insert(addr1.address, 100);
      await cappedSet.insert(addr2.address, 200);
      await cappedSet.insert(addr3.address, 300);

      // Update an existing element with a new value (150)
      await cappedSet.update(addr2.address, 150);

      const [lowestAddress, lowestValue] = await cappedSet.getMin();
      expect(lowestAddress).to.equal(addr1.address);
      expect(lowestValue).to.equal(100);
    });

    it("should handle maximum capacity and maintain the minimum value when removing existing elements", async () => {
      // Insert elements up to the maximum capacity
      await cappedSet.insert(addr1.address, 100);
      await cappedSet.insert(addr2.address, 50);
      await cappedSet.insert(addr3.address, 300);

      let [lowestAddress, lowestValue] = await cappedSet.getMin();
      expect(lowestAddress).to.equal(addr2.address);
      expect(lowestValue).to.equal(50);

      // Remove an existing element (addr2)
      await cappedSet.remove(addr2.address);

      [lowestAddress, lowestValue] = await cappedSet.getMin();
      expect(lowestAddress).to.equal(addr1.address);
      expect(lowestValue).to.equal(100);
    });

    it("should handle maximum capacity and maintain the minimum value when removing and inserting elements", async () => {
      // Insert elements up to the maximum capacity
      await cappedSet.insert(addr1.address, 100);
      await cappedSet.insert(addr2.address, 200);
      await cappedSet.insert(addr3.address, 300);

      // Remove an existing element (addr2) and insert a new element (owner)
      await cappedSet.remove(addr2.address);

      await cappedSet.insert(owner.address, 50);

      const [lowestAddress, lowestValue] = await cappedSet.getMin();
      expect(lowestAddress).to.equal(owner.address);
      expect(lowestValue).to.equal(50);
    });
  });

  describe("_shiftDown", () => {
    it("should shift down the element if j + 1 < heap.length and heap[j + 1].value < heap[j].value", async () => {
      // Insert elements into the set
      await cappedSet.insert(addr1.address, 300);
      await cappedSet.insert(addr2.address, 200);
      await cappedSet.insert(addr3.address, 100);

      // Call update() to trigger _shiftDown and shift down the element
      await cappedSet.update(addr3.address, 400);

      // Retrieve the values after the update
      const value1 = await cappedSet.getValue(addr1.address);
      const value2 = await cappedSet.getValue(addr2.address);
      const value3 = await cappedSet.getValue(addr3.address);

      // Verify that the elements have been shifted down correctly
      expect(value1).to.equal(300);
      expect(value2).to.equal(200);
      expect(value3).to.equal(400);
    });

    it("should not shift down the element if heap[i].value <= heap[j].value", async () => {
      // Insert elements into the set
      await cappedSet.insert(addr1.address, 100);
      await cappedSet.insert(addr2.address, 200);
      await cappedSet.insert(addr3.address, 300);

      // Call update() to trigger _shiftDown but heap[i].value <= heap[j].value
      await cappedSet.update(addr1.address, 50);

      // Retrieve the values after the update
      const value1 = await cappedSet.getValue(addr1.address);
      const value2 = await cappedSet.getValue(addr2.address);
      const value3 = await cappedSet.getValue(addr3.address);

      // Verify that the elements have not been shifted down
      expect(value1).to.equal(50);
      expect(value2).to.equal(200);
      expect(value3).to.equal(300);
    });
  });

  describe("_shiftUp and _shiftDown", () => {
    it("should shift up and shift down if i < heap.length", async () => {
      // Insert elements into the set
      await cappedSet.insert(addr1.address, 100);
      await cappedSet.insert(addr2.address, 200);
      await cappedSet.insert(addr3.address, 300);

      // Remove an element from the set
      await cappedSet.remove(addr2.address);

      // Retrieve the values after the removal
      const value1 = await cappedSet.getValue(addr1.address);
      const value3 = await cappedSet.getValue(addr3.address);

      // Verify that the elements have been shifted up and down correctly
      expect(value1).to.equal(100);
      expect(value3).to.equal(300);
    });

    it("should not shift up and shift down if i >= heap.length", async () => {
      // Insert elements into the set
      await cappedSet.insert(addr1.address, 100);
      await cappedSet.insert(addr2.address, 200);
      await cappedSet.insert(addr3.address, 300);

      // Remove an element from the set
      await cappedSet.remove(addr3.address);

      // Retrieve the values after the removal
      const value1 = await cappedSet.getValue(addr1.address);
      const value2 = await cappedSet.getValue(addr2.address);

      // Verify that the elements have not been shifted up and down
      expect(value1).to.equal(100);
      expect(value2).to.equal(200);
    });
  });
});
