
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract StudentRecord {

    struct Student {
        uint rollNo;
        string name;
        uint marks;
    }

    Student public student;

    // Store student details
    function setStudent(
        uint _rollNo,
        string memory _name,
        uint _marks
    ) public {
        student = Student(_rollNo, _name, _marks);
    }

    // Retrieve student details
    function getStudent()
        public
        view
        returns (uint, string memory, uint)
    {
        return (
            student.rollNo,
            student.name,
            student.marks
        );
    }
}
