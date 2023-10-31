const contractAddresses = {
  "sepolia": "0xB5462B3319Aed440bc89d910607027eb743e11C6",
  "matic": "0xb4F4360bb166787FcAF2945aFEb7Ce8f75ad7001",
  "optimism": "0x60f523cf72C2e58FB6d3182B0Ba0b062975534Ff"
};

const contractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "index",
            "type": "uint256"
          },
          {
            "components": [
              {
                "internalType": "address",
                "name": "owner",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "task",
                "type": "string"
              },
              {
                "internalType": "bool",
                "name": "isDone",
                "type": "bool"
              },
              {
                "internalType": "bool",
                "name": "isDeleted",
                "type": "bool"
              },
              {
                "internalType": "uint256",
                "name": "order",
                "type": "uint256"
              }
            ],
            "internalType": "struct TaskList.TaskItem",
            "name": "task",
            "type": "tuple"
          }
        ],
        "indexed": false,
        "internalType": "struct TaskList.TaskRecord",
        "name": "task",
        "type": "tuple"
      }
    ],
    "name": "CompletedTask",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "index",
            "type": "uint256"
          },
          {
            "components": [
              {
                "internalType": "address",
                "name": "owner",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "task",
                "type": "string"
              },
              {
                "internalType": "bool",
                "name": "isDone",
                "type": "bool"
              },
              {
                "internalType": "bool",
                "name": "isDeleted",
                "type": "bool"
              },
              {
                "internalType": "uint256",
                "name": "order",
                "type": "uint256"
              }
            ],
            "internalType": "struct TaskList.TaskItem",
            "name": "task",
            "type": "tuple"
          }
        ],
        "indexed": false,
        "internalType": "struct TaskList.TaskRecord",
        "name": "task",
        "type": "tuple"
      }
    ],
    "name": "NewTask",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "index",
            "type": "uint256"
          },
          {
            "components": [
              {
                "internalType": "address",
                "name": "owner",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "task",
                "type": "string"
              },
              {
                "internalType": "bool",
                "name": "isDone",
                "type": "bool"
              },
              {
                "internalType": "bool",
                "name": "isDeleted",
                "type": "bool"
              },
              {
                "internalType": "uint256",
                "name": "order",
                "type": "uint256"
              }
            ],
            "internalType": "struct TaskList.TaskItem",
            "name": "task",
            "type": "tuple"
          }
        ],
        "indexed": false,
        "internalType": "struct TaskList.TaskRecord",
        "name": "task",
        "type": "tuple"
      }
    ],
    "name": "UpdatedTask",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "getTasksByOwner",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "index",
            "type": "uint256"
          },
          {
            "components": [
              {
                "internalType": "address",
                "name": "owner",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "task",
                "type": "string"
              },
              {
                "internalType": "bool",
                "name": "isDone",
                "type": "bool"
              },
              {
                "internalType": "bool",
                "name": "isDeleted",
                "type": "bool"
              },
              {
                "internalType": "uint256",
                "name": "order",
                "type": "uint256"
              }
            ],
            "internalType": "struct TaskList.TaskItem",
            "name": "task",
            "type": "tuple"
          }
        ],
        "internalType": "struct TaskList.TaskRecord[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "tasks",
    "outputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "task",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "isDone",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isDeleted",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "order",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "index",
            "type": "uint256"
          },
          {
            "components": [
              {
                "internalType": "address",
                "name": "owner",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "task",
                "type": "string"
              },
              {
                "internalType": "bool",
                "name": "isDone",
                "type": "bool"
              },
              {
                "internalType": "bool",
                "name": "isDeleted",
                "type": "bool"
              },
              {
                "internalType": "uint256",
                "name": "order",
                "type": "uint256"
              }
            ],
            "internalType": "struct TaskList.TaskItem",
            "name": "task",
            "type": "tuple"
          }
        ],
        "internalType": "struct TaskList.TaskRecord[]",
        "name": "_tasks",
        "type": "tuple[]"
      }
    ],
    "name": "updateTasks",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export {contractAddresses, contractABI};
