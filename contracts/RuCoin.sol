// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * RuCoin — RUCOIN「米粒」人大学生志愿服务贡献凭证（Soulbound Credit Ledger）
 * ============================================================
 * 定位（合规铁律，见 docs/02-可行性与合规分析.md）：
 *   1) 灵魂绑定：transfer / transferFrom / approve 一律 revert —— 不可转让、不可交易；
 *   2) 无任何法币兑换、无二级市场、无融资属性 —— 不构成代币发行融资；
 *   3) 发行权角色化（校志协 / 院系志愿服务部），每笔发放必须绑定真实来源
 *      （服务记录 ID / 任务帖 ID / 活动 ID）；
 *   4) 志愿时长仅按真实服务记录，链上只做「存证影子」，法定载体仍是志愿北京。
 * 部署范围：测试网演示 → 校内联盟链 / BSN 存证（可选），禁止任何交易对与场外交易。
 */
contract RuCoin {
    string public constant NAME = "RUCOIN (RUC Volunteer Credit)";
    string public constant SYMBOL = "RUCOIN";
    uint8 public constant DECIMALS = 0; // 以「粒」为单位整数记账

    address public admin;
    mapping(address => bool) public isIssuer;

    mapping(address => uint256) public balanceOf;    // 米粒余额
    mapping(address => uint256) public serviceMinutes; // 累计志愿时长（分钟）

    struct ServiceRecord {
        uint32 minutesServed;
        uint64 timestamp;
        address issuer;
        string note;
    }
    mapping(bytes32 => ServiceRecord) public records;   // 记录ID => 服务记录（防重放）
    mapping(address => bytes32[]) public recordIdsOf;   // 志愿者 => 记录ID 列表

    // ------------------------------------------------------------------
    // ERC-20 形状的「显式禁用」：防误集成到任何 DEX / 钱包转账场景
    // ------------------------------------------------------------------
    function transfer(address, uint256) external pure returns (bool) {
        revert("RUCOIN: soulbound credit, non-transferable");
    }

    function transferFrom(address, address, uint256) external pure returns (bool) {
        revert("RUCOIN: soulbound credit, non-transferable");
    }

    function approve(address, uint256) external pure returns (bool) {
        revert("RUCOIN: soulbound credit, no allowance");
    }

    // ------------------------------------------------------------------
    modifier onlyAdmin() {
        require(msg.sender == admin, "RUCOIN: not admin");
        _;
    }

    modifier onlyIssuer() {
        require(msg.sender == admin || isIssuer[msg.sender], "RUCOIN: not issuer");
        _;
    }

    event IssuerUpdated(address indexed issuer, bool enabled);
    event Awarded(address indexed volunteer, uint256 amount, bytes32 indexed ref, string reason);
    event Redeemed(address indexed volunteer, uint256 amount, bytes32 indexed rewardId, string reward);
    event ServiceRecorded(address indexed volunteer, bytes32 indexed recordId, uint32 minutesServed);

    constructor() {
        admin = msg.sender;
        isIssuer[msg.sender] = true;
        emit IssuerUpdated(msg.sender, true);
    }

    /// 增删发行节点（校志协统一下放 / 回收院系志愿服务部的发放权）
    function setIssuer(address issuer, bool enabled) external onlyAdmin {
        require(issuer != address(0), "RUCOIN: zero address");
        isIssuer[issuer] = enabled;
        emit IssuerUpdated(issuer, enabled);
    }

    /// 发放米粒：ref = 真实来源编号（服务记录 / 任务帖 / 活动），reason = 说明
    function award(address volunteer, uint256 amount, bytes32 ref, string calldata reason)
        external
        onlyIssuer
    {
        require(volunteer != address(0), "RUCOIN: zero address");
        require(amount > 0, "RUCOIN: zero amount");
        balanceOf[volunteer] += amount;
        emit Awarded(volunteer, amount, ref, reason);
    }

    /// 权益核销：销毁米粒。米粒只减不增于消费侧 —— 不存在任何现金出口
    function redeem(address volunteer, uint256 amount, bytes32 rewardId, string calldata reward)
        external
        onlyIssuer
    {
        require(amount > 0, "RUCOIN: zero amount");
        require(balanceOf[volunteer] >= amount, "RUCOIN: insufficient balance");
        balanceOf[volunteer] -= amount;
        emit Redeemed(volunteer, amount, rewardId, reward);
    }

    /// 志愿服务时长存证：recordId 全局唯一防重放，note 可存志愿北京项目 ID
    function recordService(
        address volunteer,
        uint32 minutesServed,
        bytes32 recordId,
        string calldata note
    ) external onlyIssuer {
        require(volunteer != address(0), "RUCOIN: zero address");
        require(minutesServed > 0, "RUCOIN: zero minutes");
        require(records[recordId].timestamp == 0, "RUCOIN: record exists");
        records[recordId] = ServiceRecord({
            minutesServed: minutesServed,
            timestamp: uint64(block.timestamp),
            issuer: msg.sender,
            note: note
        });
        recordIdsOf[volunteer].push(recordId);
        serviceMinutes[volunteer] += minutesServed;
        emit ServiceRecorded(volunteer, recordId, minutesServed);
    }

    /// 作弊查处：仲裁委员会决议后清零米粒（写入社区公约的处罚条款）
    function slash(address volunteer, string calldata reason) external onlyAdmin {
        uint256 amount = balanceOf[volunteer];
        balanceOf[volunteer] = 0;
        emit Redeemed(volunteer, amount, bytes32("SLASH"), reason);
    }
}
