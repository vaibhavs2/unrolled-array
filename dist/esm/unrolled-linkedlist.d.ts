export declare class UnrolledLinkedlist<T> {
    private lastBlock;
    private blockSize;
    /**
     * Initializes an unrolled linked list with the specified block size and optionally populates it with elements from the given array.
     *
     * @param blockSize - Specifies the size of each block. The initial total capacity of the list is blockSize * blockSize, will increase further automatically
     * @param arrayElement - (Optional) An array of elements to initialize the list. The array's length must not exceed blockSize * blockSize.
     * @throws Error - Throws an error if blockSize is 0 or if the array size exceeds the list's capacity.
     */
    constructor(blockSize: number, arrayElement?: Array<T>);
    /**
     * Adds a new block to the end of the unrolled linked list.
     *
     * This method creates a new block, updates the circular references between blocks,
     * and sets the new block as the last block in the list. It also increments the
     * `blockSize` property to reflect the addition of a new block.
     */
    private _appendOneBlock;
    /**
     * Appends a given node to the end of the list within the specified block.
     *
     * @param block - The block to which the node should be appended.
     * @param node - The node to be appended into the given block.
     * @returns void
     *
     * This method updates the `listLastNode` of the block to point to the newly added node and adjusts the `next` references accordingly.
     * If the block is empty, the node is set as the first and last node of the block.
     */
    private _appendListNodeToBlock;
    /**
     * Redistributes nodes across blocks when the capacity of the list is full,
     * to accommodate new elements by increasing the number of blocks (and capacity).
     *
     * As new blocks are added, this method adjusts the number of nodes in each block
     * by shifting elements from the next block to the current block, ensuring the
     * load is evenly distributed across all blocks.
     *
     * This process helps maintain the efficiency of the unrolled linked list by balancing the blocks.
     */
    private _distributeNodesToPreviousBlocks;
    /**
     * Splits a specified number of nodes from the given block's list.
     *
     * This method extracts up to the specified `count` of nodes from the block.
     * If the block contains fewer nodes than the requested `count`, it returns all available nodes.
     *
     * @param count - The number of nodes to extract from the block's list.
     * @param block - The block from which nodes are to be extracted.
     * @returns An object containing:
     *  - `head`: The first node of the extracted sublist.
     *  - `lastNode`: The last node of the extracted sublist.
     *  - `count`: The actual number of nodes extracted.
     *
     * This method also updates the block's `listLastNode` and adjusts its `length` to reflect the removed nodes.
     */
    private _breakNodesFromBlock;
    /**
     * Calculates the block index and node index within the block based on the high-level list index.
     *
     * @param index - The overall index within the unrolled linked list.
     * @returns An object containing:
     *  - `blockIndex`: The index of the block where the node resides.
     *  - `nodeIndex`: The index of the node within the identified block.
     *
     * This method helps locate a specific node in the unrolled linked list by breaking down the
     * overall index into block-level and node-level indices.
     */
    private _getIndices;
    /**
     * Retrieves a specific block by its index.
     *
     * @param index - The block-level index (0-based) within the unrolled linked list.
     * @returns A reference to the block corresponding to the given index.
     *
     * @throws Error - Throws an error if the provided index is out of bounds.
     *
     * This method navigates through the blocks in the circular structure to locate and return the desired block.
     */
    private _getBlockByIndex;
    /**
     * Shifts nodes backward through the blocks towards the head to fill partially filled blocks
     * while maintaining the relative order of the elements.
     *
     * @param block - The starting block from which nodes are pulled to fill preceding blocks.
     *
     * This method ensures that the blocks remain balanced by redistributing nodes from later
     * blocks to earlier blocks in the list.
     */
    private _shiftElementsBackward;
    /**
     * Prepends a node to the specified block, making it the first node in the block's list.
     *
     * @param block - The block to which the node should be prepended.
     * @param node - The node to be prepended to the block.
     *
     * This method adjusts the `next` references to insert the new node at the beginning of the block's list.
     */
    private _insertAt0;
    /**
     * Calculates and returns the total size of the unrolled linked list by traversing through each block.
     *
     * @returns The total size of the list (the number of nodes across all blocks).
     *
     * This method iterates over the blocks and sums their lengths to compute the overall list size.
     */
    getSize(): number;
    /**
     * Shifts a node forward through the blocks to ensure the current block does not exceed the block size.
     *
     * This method moves the excess node from the current block to the next block while maintaining the
     * relative order of nodes. It helps manage the block's capacity by distributing nodes to subsequent blocks.
     *
     * @param block - The block where the shift operation starts.
     */
    private _shiftAElementForward;
    /**
     * Checks if the unrolled linked list has reached its maximum capacity.
     *
     * @returns `true` if the list has reached the full capacity (i.e., the total number of nodes equals `blockSize * blockSize`),
     *          otherwise `false`.
     *
     * This method helps determine whether the list has room for more elements or if it needs to expand.
     */
    private isFull;
    /**
     * Retrieves the element at the specified index in the unrolled linked list.
     *
     * @param index - The index of the element to retrieve from the list.
     * @returns The element located at the specified index.
     *
     * @throws Error - Throws an error if the index is out of bounds.
     *
     * This method traverses the appropriate block and node to return the data at the given index.
     */
    get(index: number): T;
    /**
     * Pushes a new element to the end of the list.
     *
     * @param data - The element to be added to the list.
     *
     * This method traverses the first available block and appends the new element to the block's list.
     * It updates the `listLastNode` reference to point to the newly added node, ensuring the block’s last node is always correctly referenced.
     */
    push(data: T): void;
    /**
     * Deletes the element at the specified index and rebalances the list.
     *
     * @param index - The index of the element to be deleted from the list.
     * @returns Nothing. This method modifies the list by removing the element and adjusting the structure.
     *
     * This method ensures that after deletion, the list remains balanced by shifting elements as needed to maintain the block structure.
     */
    delete(index: number): void;
    /**
     * Inserts a new element at the specified index in the list, shifting elements as necessary.
     *
     * @param index - The index at which the element should be inserted.
     * @param data - The element to be inserted into the list.
     *
     * @throws Error - Throws an error if the insertion is not possible (e.g., invalid index).
     *
     * This method adjusts the block structure and maintains the relative order of nodes by inserting the element
     * at the specified position, shifting elements in the affected blocks if necessary.
     */
    insert(index: number, data: T): void;
    /**
     * Iterates over each element in the list and applies the provided callback function.
     *
     * @param callbackFun - A function that will be executed for each element, receiving the data and its index.
     *
     * This method provides a convenient way to traverse the entire list and perform operations on each element
     * by invoking the callback for each element in the list.
     */
    loopOver(callbackFun: (data: T, index: number) => void): void;
}
