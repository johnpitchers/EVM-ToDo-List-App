// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0 ;
pragma experimental ABIEncoderV2;

contract TaskList {
  struct TaskItem {
    address owner;
    string task;
    bool isDone;
    bool isDeleted;
    uint256 order; // Front end application can use this how ever it sees fit.
  }

  struct TaskRecord {
    uint256 index;
    TaskItem task;
  }

  TaskItem[] public tasks;

  event NewTask(TaskRecord task);
  event UpdatedTask(TaskRecord task);
  event CompletedTask(TaskRecord task);

  mapping(uint256 => address) taskToOwner;
  mapping(address => uint256) ownerTaskCount;

  modifier isOwner(uint256 _id) {
    require(msg.sender == taskToOwner[_id], "Task not owned by msg.sender.");
    _;
  }

  modifier isValidTask(string memory _task) {
    require(bytes(_task).length < 128, "Task length too long.");
    _;
  }

 /**
   * @dev Create a dummy task at index 0. Any task sent from the front end app with index 0 will be
   *  recognized as new tasks and added to the end of the tasks array.
   */

  constructor(){
    createTask(" ", false, false, 0);
  }

  /**
  * @dev Create a new task. Private function called by either of the above createTask() functions.
  * @param _task The task description.
  * @param _order The task order.
  * @notice The task description must be less than 128 characters.
  * @return A TaskItem struct representing the created task.
  */
  function createTask(string memory _task, bool _isDone, bool _isDeleted, uint256 _order) private isValidTask(_task) returns (TaskItem memory) {
    address sender = msg.sender;
    if (tasks.length == 0){
      // For dummy address created during construct();
      sender = 0x0000000000000000000000000000000000000000;
    }
    TaskItem memory task = TaskItem(sender, _task, _isDone, _isDeleted, _order);
    tasks.push(task);
    taskToOwner[tasks.length - 1] = sender;
    ownerTaskCount[sender] = ownerTaskCount[sender] + 1;
    TaskRecord memory taskRecord = TaskRecord(tasks.length - 1, task);
    emit NewTask(taskRecord);
    return task;
  }

  /**
   * @dev Edit a task.
   * @param _id The ID of the task to edit.
   * @param _task The task description.
   * @param _isDone The task completion status.
   * @param _isDeleted The task deletion status.
   * @param _order The task order.
   * @notice Only the owner of the task can edit it.
   * @notice The task description must be less than 128 characters.
   * @notice Emits an UpdatedTask event.
   */
  function editTask(uint256 _id, string memory _task, bool _isDone, bool _isDeleted, uint256 _order ) internal isValidTask(_task) isOwner(_id) {
    tasks[_id] = TaskItem(msg.sender, _task, _isDone, _isDeleted, _order);
    emit UpdatedTask(TaskRecord(_id, tasks[_id]));
  }


  function updateTasks(TaskRecord[] memory _tasks) external {
    for (uint i = 0; i < _tasks.length;i++) {
      uint index = uint(_tasks[i].index);
       if (index == 0){
        createTask(_tasks[i].task.task, _tasks[i].task.isDone, _tasks[i].task.isDeleted, _tasks[i].task.order);
        continue;
      }
      TaskItem memory task = _tasks[i].task;
      editTask(index, task.task, task.isDone, task.isDeleted, task.order);
    }
  }

  /**
   * @dev Retrieves all tasks owned by the caller. Includes deleted tasks.
   * @return An array of TaskRecord structs representing the tasks owned by the caller.
   */
  function getTasksByOwner() external view returns (TaskRecord[] memory) {
    uint256 taskCount = 0;
    uint256 index = 1; // Skip the 0 index. See the constructor comment.
    TaskRecord[] memory ownerTaskRecords = new TaskRecord[](
      ownerTaskCount[msg.sender]
    );
    while (taskCount < ownerTaskCount[msg.sender]) {
      if (tasks[index].owner == msg.sender) {
        ownerTaskRecords[taskCount] = TaskRecord(index, tasks[index]);
        taskCount++;
      }
      index++;
    }
    return ownerTaskRecords;
  }
}
