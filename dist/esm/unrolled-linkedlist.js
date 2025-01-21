class ListNode {
    constructor(data) {
        this.data = data;
        this.next = this;
    }
}
class BlockNode {
    constructor() {
        this.length = 0;
        this.listLastNode = null;
        this.next = this;
    }
}
export class UnrolledLinkedlist {
    /**
     * Initializes an unrolled linked list with the specified block size and optionally populates it with elements from the given array.
     *
     * @param blockSize - Specifies the size of each block. The initial total capacity of the list is blockSize * blockSize, will increase further automatically
     * @param arrayElement - (Optional) An array of elements to initialize the list. The array's length must not exceed blockSize * blockSize.
     * @throws Error - Throws an error if blockSize is 0 or if the array size exceeds the list's capacity.
     */
    constructor(blockSize, arrayElement) {
        this.lastBlock = new BlockNode();
        this.blockSize = 1;
        if (blockSize == 0) {
            throw new Error("Can't initiate with 0 blocks");
        }
        if (arrayElement && arrayElement.length > blockSize * blockSize) {
            throw new Error(`Can't carry the whole array withing ${blockSize} block size`);
        }
        for (let i = 0; i < blockSize; i++) {
            let j = i * blockSize;
            const maxlistSize = (i + 1) * blockSize;
            for (; arrayElement && j < arrayElement.length && j < maxlistSize; j++) {
                const nListNode = new ListNode(arrayElement[j]);
                this._appendListNodeToBlock(this.lastBlock, nListNode);
            }
            if (i > 0)
                this._appendOneBlock();
        }
    }
    /**
     * Adds a new block to the end of the unrolled linked list.
     *
     * This method creates a new block, updates the circular references between blocks,
     * and sets the new block as the last block in the list. It also increments the
     * `blockSize` property to reflect the addition of a new block.
     */
    _appendOneBlock() {
        this.blockSize++;
        const nBlock = new BlockNode();
        nBlock.next = this.lastBlock.next;
        this.lastBlock.next = nBlock;
        this.lastBlock = nBlock;
    }
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
    _appendListNodeToBlock(block, node) {
        block.length++;
        if (block.listLastNode == null) {
            block.listLastNode = node;
            return;
        }
        node.next = block.listLastNode.next;
        block.listLastNode.next = node;
        block.listLastNode = node;
    }
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
    _distributeNodesToPreviousBlocks() {
        const newBlockSize = this.blockSize + 1;
        let tBlock = this.lastBlock.next;
        for (; tBlock.next.length && tBlock != this.lastBlock; tBlock = tBlock.next) {
            const nodesNeeded = newBlockSize - tBlock.length;
            if (nodesNeeded == 0)
                continue;
            const { head, lastNode, count } = this._breakNodesFromBlock(nodesNeeded, tBlock.next);
            const tbHead = tBlock.listLastNode.next;
            tBlock.listLastNode.next = head;
            lastNode.next = tbHead;
            tBlock.listLastNode = lastNode;
            tBlock.length += count;
        }
    }
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
    _breakNodesFromBlock(count, block) {
        let tHead = block.listLastNode;
        const head = block.listLastNode.next;
        let countingBreakingNodes = 0;
        do {
            count--;
            countingBreakingNodes++;
            tHead = tHead.next;
        } while (count > 0 && tHead != block.listLastNode);
        if (tHead == block.listLastNode) {
            block.listLastNode = null;
        }
        else {
            block.listLastNode.next = tHead.next;
        }
        block.length -= countingBreakingNodes;
        return { head, lastNode: tHead, count: countingBreakingNodes };
    }
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
    _getIndices(index) {
        return {
            blockIndex: Math.floor(index / this.blockSize),
            nodeIndex: index % this.blockSize,
        };
    }
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
    _getBlockByIndex(index) {
        if (index >= this.blockSize) {
            throw new Error("Block out of bound");
        }
        let tBlock = this.lastBlock.next;
        while (index--) {
            tBlock = tBlock.next;
        }
        return tBlock;
    }
    /**
     * Shifts nodes backward through the blocks towards the head to fill partially filled blocks
     * while maintaining the relative order of the elements.
     *
     * @param block - The starting block from which nodes are pulled to fill preceding blocks.
     *
     * This method ensures that the blocks remain balanced by redistributing nodes from later
     * blocks to earlier blocks in the list.
     */
    _shiftElementsBackward(block) {
        while (block != this.lastBlock && block.next.length) {
            const headOfNext = block.next.listLastNode.next;
            if (block.next.length == 1) {
                block.next.length = 0;
                block.next.listLastNode = null;
            }
            else {
                block.next.listLastNode.next = block.next.listLastNode.next.next;
                block.next.length--;
            }
            headOfNext.next = block.listLastNode.next;
            block.listLastNode.next = headOfNext;
            block.listLastNode = headOfNext;
            block.length++;
            block = block.next;
        }
    }
    /**
     * Prepends a node to the specified block, making it the first node in the block's list.
     *
     * @param block - The block to which the node should be prepended.
     * @param node - The node to be prepended to the block.
     *
     * This method adjusts the `next` references to insert the new node at the beginning of the block's list.
     */
    _insertAt0(block, node) {
        if (block.length == 0) {
            block.listLastNode = node;
            node.next = node;
        }
        else {
            node.next = block.listLastNode.next;
            block.listLastNode.next = node;
        }
        block.length++;
    }
    /**
     * Calculates and returns the total size of the unrolled linked list by traversing through each block.
     *
     * @returns The total size of the list (the number of nodes across all blocks).
     *
     * This method iterates over the blocks and sums their lengths to compute the overall list size.
     */
    getSize() {
        let bHead = this.lastBlock.next;
        let size = 0;
        do {
            size += bHead.length;
            bHead = bHead.next;
        } while (bHead != this.lastBlock.next);
        return size;
    }
    /**
     * Shifts a node forward through the blocks to ensure the current block does not exceed the block size.
     *
     * This method moves the excess node from the current block to the next block while maintaining the
     * relative order of nodes. It helps manage the block's capacity by distributing nodes to subsequent blocks.
     *
     * @param block - The block where the shift operation starts.
     */
    _shiftAElementForward(block) {
        while (block != this.lastBlock && block.length > this.blockSize) {
            let prevLastListNodeOfCurr = block.listLastNode.next;
            while (prevLastListNodeOfCurr.next != block.listLastNode) {
                prevLastListNodeOfCurr = prevLastListNodeOfCurr.next;
            }
            block.length--;
            const lastListNode = prevLastListNodeOfCurr.next;
            prevLastListNodeOfCurr.next = prevLastListNodeOfCurr.next.next;
            block.listLastNode = prevLastListNodeOfCurr;
            lastListNode.next = lastListNode;
            this._insertAt0(block.next, lastListNode);
            block = block.next;
        }
    }
    /**
     * Checks if the unrolled linked list has reached its maximum capacity.
     *
     * @returns `true` if the list has reached the full capacity (i.e., the total number of nodes equals `blockSize * blockSize`),
     *          otherwise `false`.
     *
     * This method helps determine whether the list has room for more elements or if it needs to expand.
     */
    isFull() {
        return this.getSize() == this.blockSize * this.blockSize;
    }
    //   printItems() {
    //     let head = this.lastBlock.next;
    //     let i = 0;
    //     do {
    //       console.log("printing block index", { index: i, length: head.length });
    //       if (!head.length) {
    //         head = head.next;
    //         continue;
    //       }
    //       let listHead = head.listLastNode?.next;
    //       do {
    //         console.log(listHead.data);
    //         listHead = listHead.next;
    //       } while (listHead != head.listLastNode.next);
    //       head = head.next;
    //       i++;
    //     } while (head != this.lastBlock.next);
    //   }
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
    get(index) {
        let { blockIndex, nodeIndex } = this._getIndices(index);
        const block = this._getBlockByIndex(blockIndex);
        if (block.length <= nodeIndex) {
            throw new Error("Index out of bound");
        }
        let tHead = block.listLastNode.next;
        while (nodeIndex--) {
            tHead = tHead.next;
        }
        return tHead.data;
    }
    /**
     * Pushes a new element to the end of the list.
     *
     * @param data - The element to be added to the list.
     *
     * This method traverses the first available block and appends the new element to the block's list.
     * It updates the `listLastNode` reference to point to the newly added node, ensuring the block’s last node is always correctly referenced.
     */
    push(data) {
        const nNode = new ListNode(data);
        let tBlock = this.lastBlock;
        do {
            tBlock = tBlock.next;
        } while (tBlock != this.lastBlock && tBlock.length == this.blockSize);
        if (tBlock.length < this.blockSize) {
            this._appendListNodeToBlock(tBlock, nNode);
        }
        else {
            if (this.blockSize != 1) {
                this._distributeNodesToPreviousBlocks();
            }
            this._appendOneBlock();
            this._appendListNodeToBlock(tBlock, nNode);
        }
    }
    /**
     * Deletes the element at the specified index and rebalances the list.
     *
     * @param index - The index of the element to be deleted from the list.
     * @returns Nothing. This method modifies the list by removing the element and adjusting the structure.
     *
     * This method ensures that after deletion, the list remains balanced by shifting elements as needed to maintain the block structure.
     */
    delete(index) {
        let { blockIndex, nodeIndex } = this._getIndices(index);
        const block = this._getBlockByIndex(blockIndex);
        if (block.length <= nodeIndex) {
            throw new Error(`Index out of bound ${index}`);
        }
        block.length--;
        let tHead = block.listLastNode.next;
        if (tHead == block.listLastNode) {
            block.listLastNode = null;
            block.length = 0;
            return;
        }
        if (nodeIndex == 0) {
            block.listLastNode.next = block.listLastNode.next.next;
        }
        else {
            while (nodeIndex-- > 1) {
                tHead = tHead.next;
            }
            if (tHead.next == block.listLastNode) {
                block.listLastNode = tHead;
            }
            tHead.next = tHead.next.next;
        }
        this._shiftElementsBackward(block);
    }
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
    insert(index, data) {
        let { blockIndex, nodeIndex } = this._getIndices(index);
        const wasFull = this.isFull();
        if (blockIndex == this.blockSize && wasFull) {
            if (nodeIndex > 0) {
                throw new Error("Can't insert without previous node");
            }
            blockIndex--;
            nodeIndex = index % (this.blockSize + 1);
        }
        const block = this._getBlockByIndex(blockIndex);
        if (block.length < nodeIndex) {
            throw new Error("Can't insert without previous node");
        }
        const nNode = new ListNode(data);
        if (nodeIndex == 0) {
            this._insertAt0(block, nNode);
        }
        else if ((nodeIndex = block.length)) {
            nNode.next = block.listLastNode.next;
            block.listLastNode.next = nNode;
            block.listLastNode = nNode;
            block.length++;
        }
        else {
            let tNodeHead = block.listLastNode.next;
            while (nodeIndex > 1) {
                tNodeHead = tNodeHead.next;
                nodeIndex--;
            }
            nNode.next = tNodeHead.next;
            tNodeHead.next = nNode;
            block.length++;
        }
        if (wasFull) {
            this._distributeNodesToPreviousBlocks();
            this._appendOneBlock();
            return;
        }
        this._shiftAElementForward(block);
    }
    /**
     * Iterates over each element in the list and applies the provided callback function.
     *
     * @param callbackFun - A function that will be executed for each element, receiving the data and its index.
     *
     * This method provides a convenient way to traverse the entire list and perform operations on each element
     * by invoking the callback for each element in the list.
     */
    loopOver(callbackFun) {
        let bHead = this.lastBlock.next;
        let index = 0;
        if (bHead == null)
            return;
        do {
            let lHead = bHead.listLastNode?.next;
            do {
                if (!lHead)
                    return;
                callbackFun(lHead.data, index++);
                lHead = lHead.next;
            } while (lHead != bHead.listLastNode.next);
            bHead = bHead.next;
        } while (bHead !== this.lastBlock.next);
    }
}
