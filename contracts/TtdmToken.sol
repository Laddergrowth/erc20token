pragma solidity ^0.5.0;
import "./SafeMath.sol";

contract TtdmToken {

    using SafeMath for uint256;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;

    mapping (address => mapping (address => uint256)) private allowed;
    
    string public name = 'ttdmcoin';
    string public symbol = 'TTDM';
    uint8 public decimals = 2;

    event Transfer(
      address indexed _from,
      address indexed _to,
      uint256 _value
    );

    event Approval(
      address indexed _owner,
      address indexed _spender,
      uint256 _value
    );

    constructor(uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    //Transfer
    function transfer(address _to, uint256 _value) public returns (bool success) {
      //Exception if account does't have enough
      require(balanceOf[msg.sender] >= _value);
      balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);
      balanceOf[_to] = balanceOf[_to].add(_value);
      emit Transfer(msg.sender, _to, _value);
      return true;
    }
    function approve(address _spender, uint256 _value) public returns (bool success) {
      allowed[msg.sender][_spender] = _value;
      emit Approval(msg.sender, _spender, _value);
      return true;
    }  
    function allowance(address owner, address spender) public view returns (uint256) {
       return allowed[owner][spender];
    }
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
      require(_value <= balanceOf[_from]);
      require(_value <= allowed[_from][msg.sender]);

      balanceOf[_from] = balanceOf[_from].sub(_value);
      balanceOf[_to] = balanceOf[_to].add(_value);
      allowed[_from][msg.sender] =  allowed[_from][msg.sender].sub(_value);
      emit Transfer(_from,_to, _value);
      return true;
    }
}