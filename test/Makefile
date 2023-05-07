one:
	mkdir -p ../challenge/one/
	mkdir -p ../challenge/one/contracts
	cp ../src/contracts/Variables.sol ../challenge/one/contracts/
	cp ../src/hardhat.config.js ../challenge/one/
	cp test_one.js ../challenge/one/
	(cd ../challenge/one/ && npx hardhat compile)
	(cd ../challenge/one/ && npx hardhat test test_one.js)

two:
	mkdir -p ../challenge/two/
	mkdir -p ../challenge/two/contracts
	cp ../src/contracts/Variables.sol ../challenge/two/contracts/
	cp ../src/hardhat.config.js ../challenge/two/
	cp test_two.js ../challenge/two/
	(cd ../challenge/two/ && npx hardhat compile)
	(cd ../challenge/two/ && npx hardhat test test_two.js)

three:
	mkdir -p ../challenge/three/
	cp ../src/challenge_one.js ../challenge/three/
	npx jest