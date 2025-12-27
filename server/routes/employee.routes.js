const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");

// GET Dashboard Stats
router.get("/dashboard-stats", async (req, res) => {
  try {
    const stats = await Employee.aggregate([
      {
        $facet: {
          // 1. General Totals
          totalStats: [
            {
              $group: {
                _id: null,
                totalEmployees: { $sum: 1 },
                totalSalary: { $sum: "$salary" },
                avgSalary: { $avg: "$salary" },
              },
            },
          ],
          // 2. Grouping by Department for Pie Chart
          deptStats: [{ $group: { _id: "$department", count: { $sum: 1 } } }],
          // 3. Grouping by Position for Bar Chart
          positionStats: [{ $group: { _id: "$position", count: { $sum: 1 } } }],
        },
      },
    ]);
    res.json(stats[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET All Employees
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET Single Employee by ID
router.get("/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST Create Employee
router.post("/", async (req, res) => {
  const employee = new Employee(req.body);
  try {
    const newEmployee = await employee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT Update Employee
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const updatedEmployee = await Employee.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(updatedEmployee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE Employee
router.delete("/:id", async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    res.json(deletedEmployee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
