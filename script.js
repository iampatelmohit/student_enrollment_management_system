
// Global variables
let students = [];
let currentEditId = null;
let studentIdCounter = 1;

// Tab functionality
function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab content
    document.getElementById(tabName + 'Tab').classList.add('active');

    // Add active class to selected tab
    event.target.classList.add('active');

    // Update analytics when analytics tab is shown
    if (tabName === 'analytics') {
        updateAnalytics();
    }
}

// Form submission
document.getElementById('enrollmentForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = {
        id: studentIdCounter++,
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        dob: document.getElementById('dob').value,
        program: document.getElementById('program').value,
        academicYear: document.getElementById('academicYear').value,
        enrollmentType: document.getElementById('enrollmentType').value,
        gpa: document.getElementById('gpa').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        status: 'Active',
        enrollmentDate: new Date().toLocaleDateString()
    };

    students.push(formData);
    updateStudentTable();
    showSuccessMessage();
    this.reset();
});

// Update student table
function updateStudentTable() {
    const tbody = document.getElementById('studentsTableBody');
    const totalStudents = document.getElementById('totalStudents');

    if (students.length === 0) {
        tbody.innerHTML = `
                    <tr>
                        <td colspan="7" class="empty-state">
                            <div class="empty-state-icon">📚</div>
                            <div>No students enrolled yet. Use the enrollment form to add students.</div>
                        </td>
                    </tr>
                `;
    } else {
        tbody.innerHTML = students.map(student => `
                    <tr>
                        <td><strong>${student.id}</strong></td>
                        <td>${student.fullName}</td>
                        <td>${student.email}</td>
                        <td>${student.program}</td>
                        <td>${student.enrollmentType}</td>
                        <td>
                            <span class="status-badge status-${student.status.toLowerCase()}">
                                ${student.status}
                            </span>
                        </td>
                        <td>
                            <button onclick="editStudent(${student.id})" class="btn" style="background: #17a2b8; color: white; padding: 6px 12px; margin-right: 5px;">Edit</button>
                            <button onclick="deleteStudent(${student.id})" class="btn btn-danger" style="padding: 6px 12px;">Delete</button>
                        </td>
                    </tr>
                `).join('');
    }

    totalStudents.textContent = students.length;
}

// Edit student
function editStudent(id) {
    const student = students.find(s => s.id === id);
    if (student) {
        currentEditId = id;
        document.getElementById('editStatus').value = student.status;
        document.getElementById('editModal').classList.add('active');
    }
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
}

// Save edit
function saveEdit() {
    if (currentEditId) {
        const student = students.find(s => s.id === currentEditId);
        if (student) {
            student.status = document.getElementById('editStatus').value;
            updateStudentTable();
            updateAnalytics();
            closeEditModal();
            showSuccessMessage('Student status updated successfully!');
        }
    }
}

// Delete student with inline confirmation
function deleteStudent(id) {
    const row = event.target.closest('tr');
    const actionsCell = row.querySelector('td:last-child');
    const originalContent = actionsCell.innerHTML;

    actionsCell.innerHTML = `
                <button onclick="confirmDelete(${id})" class="btn btn-danger" style="padding: 6px 12px; margin-right: 5px;">Confirm Delete</button>
                <button onclick="cancelDelete(this, \`${originalContent.replace(/`/g, '\\`')}\`)" class="btn btn-secondary" style="padding: 6px 12px;">Cancel</button>
            `;
}

// Confirm delete
function confirmDelete(id) {
    students = students.filter(s => s.id !== id);
    updateStudentTable();
    updateAnalytics();
    showSuccessMessage('Student deleted successfully!');
}

// Cancel delete
function cancelDelete(button, originalContent) {
    const actionsCell = button.closest('td');
    actionsCell.innerHTML = originalContent;
}

// Apply filters
function applyFilters() {
    const searchName = document.getElementById('searchName').value.toLowerCase();
    const filterProgram = document.getElementById('filterProgram').value;
    const filterType = document.getElementById('filterType').value;

    let filteredStudents = students.filter(student => {
        const matchesName = !searchName || student.fullName.toLowerCase().includes(searchName);
        const matchesProgram = !filterProgram || student.program === filterProgram;
        const matchesType = !filterType || student.enrollmentType === filterType;

        return matchesName && matchesProgram && matchesType;
    });

    displaySearchResults(filteredStudents);
}

// Display search results
function displaySearchResults(results) {
    const resultsContainer = document.getElementById('searchResults');

    if (results.length === 0) {
        resultsContainer.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">❌</div>
                        <div>No students found matching your criteria</div>
                    </div>
                `;
        return;
    }

    resultsContainer.innerHTML = `
                <div style="margin-bottom: 20px;">
                    <strong style="color: #333;">Found ${results.length} student(s):</strong>
                </div>
                <div style="display: grid; gap: 15px;">
                    ${results.map(student => `
                        <div style="background: #f8f9ff; padding: 20px; border-radius: 12px; border-left: 4px solid #667eea;">
                            <div style="display: flex; justify-content: between; align-items: start; flex-wrap: wrap;">
                                <div style="flex: 1;">
                                    <h4 style="margin: 0 0 8px 0; color: #333; font-size: 1.1rem;">${student.fullName}</h4>
                                    <p style="margin: 4px 0; color: #666; font-size: 14px;">📧 ${student.email}</p>
                                    <p style="margin: 4px 0; color: #666; font-size: 14px;">🎓 ${student.program} - ${student.enrollmentType}</p>
                                </div>
                                <span class="status-badge status-${student.status.toLowerCase()}" style="margin-left: 15px;">
                                    ${student.status}
                                </span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
}

// Update analytics
function updateAnalytics() {
    const totalEnrolled = students.length;
    const activeStudents = students.filter(s => s.status === 'Active').length;
    const gpaValues = students.filter(s => s.gpa && s.gpa !== '').map(s => parseFloat(s.gpa));
    const avgGPA = gpaValues.length > 0 ? (gpaValues.reduce((a, b) => a + b, 0) / gpaValues.length).toFixed(2) : '0.0';

    document.getElementById('totalEnrolled').textContent = totalEnrolled;
    document.getElementById('activeStudents').textContent = activeStudents;
    document.getElementById('avgGPA').textContent = avgGPA;

    // Program statistics
    const programCounts = {};
    students.forEach(student => {
        programCounts[student.program] = (programCounts[student.program] || 0) + 1;
    });

    const programStatsHTML = Object.keys(programCounts).length > 0
        ? Object.entries(programCounts).map(([program, count]) => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #f8f9ff; border-radius: 8px; margin-bottom: 10px;">
                        <span style="color: #333; font-weight: 500;">${program}</span>
                        <span style="font-weight: 700; color: #667eea; font-size: 1.2rem;">${count}</span>
                    </div>
                `).join('')
        : `<div class="empty-state">
                    <div style="font-size: 2rem; margin-bottom: 10px;">📈</div>
                    <div>No enrollment data available</div>
                   </div>`;

    document.getElementById('programStats').innerHTML = programStatsHTML;

    // Type statistics
    const typeCounts = {};
    students.forEach(student => {
        typeCounts[student.enrollmentType] = (typeCounts[student.enrollmentType] || 0) + 1;
    });

    const typeStatsHTML = Object.keys(typeCounts).length > 0
        ? Object.entries(typeCounts).map(([type, count]) => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #f8f9ff; border-radius: 8px; margin-bottom: 10px;">
                        <span style="color: #333; font-weight: 500;">${type}</span>
                        <span style="font-weight: 700; color: #667eea; font-size: 1.2rem;">${count}</span>
                    </div>
                `).join('')
        : `<div class="empty-state">
                    <div style="font-size: 2rem; margin-bottom: 10px;">📊</div>
                    <div>No enrollment data available</div>
                   </div>`;

    document.getElementById('typeStats').innerHTML = typeStatsHTML;
}

// Show success message
function showSuccessMessage(message = 'Student enrolled successfully!') {
    const successMsg = document.getElementById('successMessage');
    successMsg.querySelector('span').textContent = message;
    successMsg.classList.add('show');

    setTimeout(() => {
        successMsg.classList.remove('show');
    }, 3000);
}

// Add event listeners for real-time search
document.getElementById('searchName').addEventListener('input', applyFilters);
document.getElementById('filterProgram').addEventListener('change', applyFilters);
document.getElementById('filterType').addEventListener('change', applyFilters);

// Initialize with sample data
function initializeSampleData() {
    const sampleStudents = [
        {
            id: studentIdCounter++,
            fullName: "Alice Johnson",
            email: "alice.johnson@email.com",
            phone: "555-0123",
            dob: "2000-05-15",
            program: "Computer Science",
            academicYear: "2024-2025",
            enrollmentType: "Full-time",
            gpa: "3.8",
            address: "123 Main St",
            city: "Springfield",
            status: "Active",
            enrollmentDate: "2024-01-15"
        },
        {
            id: studentIdCounter++,
            fullName: "Bob Smith",
            email: "bob.smith@email.com",
            phone: "555-0124",
            dob: "1999-08-22",
            program: "Business Administration",
            academicYear: "2024-2025",
            enrollmentType: "Part-time",
            gpa: "3.5",
            address: "456 Oak Ave",
            city: "Springfield",
            status: "Active",
            enrollmentDate: "2024-01-20"
        }
    ];

    students.push(...sampleStudents);
    updateStudentTable();
}

// Initialize the application
initializeSampleData();
