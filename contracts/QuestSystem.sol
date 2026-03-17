// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract QuestSystem is Ownable, ReentrancyGuard {
    struct Quest {
        string title;
        string description;
        uint256 reward;
        uint256 totalSteps;
        uint256 difficulty;
        bool isActive;
        uint256 participantCount;
    }
    
    struct UserQuest {
        uint256 questId;
        address user;
        uint256 currentStep;
        bool isCompleted;
        uint256 startedAt;
        uint256 completedAt;
    }
    
    // ERC20 token for rewards (SOMI token)
    IERC20 public rewardToken;
    
    // Quest storage
    mapping(uint256 => Quest) public quests;
    uint256 public questCount;
    
    // User quest progress
    mapping(address => mapping(uint256 => UserQuest)) public userQuests;
    
    // Events for real-time updates (Somnia Reactivity)
    event QuestStarted(uint256 indexed questId, address indexed user, uint256 timestamp);
    event QuestProgressUpdated(uint256 indexed questId, address indexed user, uint256 currentStep, uint256 totalSteps);
    event QuestCompleted(uint256 indexed questId, address indexed user, uint256 reward, uint256 timestamp);
    event RewardDistributed(address indexed user, uint256 amount, string reason);
    
    constructor(address _rewardToken) {
        rewardToken = IERC20(_rewardToken);
    }
    
    function createQuest(
        string memory _title,
        string memory _description,
        uint256 _reward,
        uint256 _totalSteps,
        uint256 _difficulty
    ) external onlyOwner {
        quests[questCount] = Quest({
            title: _title,
            description: _description,
            reward: _reward,
            totalSteps: _totalSteps,
            difficulty: _difficulty,
            isActive: true,
            participantCount: 0
        });
        
        questCount++;
    }
    
    function startQuest(uint256 _questId) external nonReentrant {
        require(quests[_questId].isActive, "Quest not active");
        require(!userQuests[msg.sender][_questId].isCompleted, "Quest already completed");
        require(userQuests[msg.sender][_questId].startedAt == 0, "Quest already started");
        // Handle real-time quest updates based on blockchain events
        
        // Example: Parse transaction events and update quest progress
        // This is where you'd implement the logic to react to blockchain events
        // and automatically update quest progress
    }
    
    function updateQuestProgress(uint256 questId) external {
        require(questId < questCounter, "Quest does not exist");
        require(quests[questId].isActive, "Quest is not active");
        require(block.timestamp <= quests[questId].deadline, "Quest has expired");
        
        QuestProgress storage progress = userProgress[msg.sender][questId];
        require(!progress.isCompleted, "Quest already completed");
        
        // Increment progress
        progress.currentProgress++;
        progress.user = msg.sender;
        progress.questId = questId;
        
        // Emit progress update event
        emit QuestProgressUpdated(
            msg.sender,
            questId,
            progress.currentProgress,
            quests[questId].totalSteps,
            block.timestamp
        );
        
        // Check if quest is completed
        if (progress.currentProgress >= quests[questId].totalSteps) {
            progress.isCompleted = true;
            progress.completedAt = block.timestamp;
            userCompletedQuests[msg.sender].push(questId);
            
            // Emit completion event
            emit QuestCompleted(
                msg.sender,
                questId,
                quests[questId].reward,
                block.timestamp
            );
            
            // Check for achievements
            _checkAchievements(msg.sender);
        }
    }
    
    function _checkAchievements(address user) internal {
        uint256 completedCount = userCompletedQuests[user].length;
        
        // First Quest Achievement
        if (completedCount == 1) {
            emit AchievementUnlocked(user, "First Quest", 1, block.timestamp);
        }
        
        // Quest Master Achievement (10 quests)
        if (completedCount == 10) {
            emit AchievementUnlocked(user, "Quest Master", 3, block.timestamp);
        }
        
        // Speed Demon (complete quest within 1 hour)
        for (uint i = 0; i < completedCount; i++) {
            uint256 questId = userCompletedQuests[user][i];
            QuestProgress storage progress = userProgress[user][questId];
            if (progress.completedAt > 0 && 
                (progress.completedAt - block.timestamp) < 1 hours) {
                emit AchievementUnlocked(user, "Speed Demon", 2, block.timestamp);
                break;
            }
        }
    }
    
    function getQuest(uint256 questId) external view returns (Quest memory) {
        require(questId < questCounter, "Quest does not exist");
        return quests[questId];
    }
    
    function getUserProgress(address user, uint256 questId) external view returns (QuestProgress memory) {
        return userProgress[user][questId];
    }
    
    function getUserCompletedQuests(address user) external view returns (uint256[] memory) {
        return userCompletedQuests[user];
    }
    
    function getTotalQuests() external view returns (uint256) {
        return questCounter;
    }
}
