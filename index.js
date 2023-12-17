const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const connection = require('./connection'); 

const app = express();

app.use(session({
  secret: 'G#7p2zLq$9!vW&4s', 
  resave: true,
  saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('index');
}); 

app.get('/placement-portal', (req, res) => {
  res.render('portal');
});

app.get('/student-login', (req, res) => {
  res.render('studentLogin');
});
app.get('/recruiter-login', (req, res) => {
  res.render('recruiterLogin');
});

app.get('/admin-login', (req, res) => {
  res.render('adminLogin');
});
app.get('/admin-dashboard', (req, res) => {
  res.render('adminDashboard');
});
app.get('/register-recruiter', (req, res) => {
  res.render('recruiterSignup');
});
app.get('/delete-recruiter', (req, res) => {
  res.render('deleteRecruiter');
});
app.get('/register-student', (req, res) => {
  res.render('studentSignup');
});
app.get('/delete-student', (req, res) => {
  res.render('deleteStudent');
});
app.get('/student-dashboard', (req, res) => {
  res.render('studentDashboard');
});
app.get('/recruiter-dashboard', (req, res) => {
  res.render('recruiterDashboard');
});
app.get('/post-jobs', (req, res) => {
  res.render('postjobs');
});
app.get('/posted-jobs', (req, res) => {
  res.render('postedJobs');
});
app.get('/explore-jobs', (req, res) => {
  res.render('exploreJobs');
});
app.get('/job-applications', (req, res) => {
  res.render('applications');
});
app.get('/student-profiles', (req, res) => {
  res.render('studentProfiles');
}); 




app.post('/admin-login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
 
  connection.query(
    "SELECT * FROM admins WHERE username = ? AND password = ?",
    [username, password],
    (err, results) => {
      if (err) {
        console.error('Error querying the database: ' + err.stack);
        return res.status(500).send('Internal Server Error');
      }

      if (results.length > 0) {
        res.redirect('/admin-dashboard');
      } else {
        res.status(401).send('Invalid credentials');
        
      }
    }
  );
});

app.post('/add-recruiter', (req, res) => {
  const { username, password, name, email, phone_number, company_name } = req.body;

  connection.query(
    'INSERT INTO recruiters (username, password, name, email, phone_number, company_name) VALUES (?, ?, ?, ?, ?, ?)',
    [username, password, name, email, phone_number, company_name],
    (err, results) => {
      if (err) {
        console.error('Error inserting recruiter data:', err);
        return res.status(500).send('Internal Server Error');
      }

      res.redirect('/register-recruiter');
    }
  );
});



app.get('/all-recruiters', (req, res) => {
  const query = 'SELECT * FROM recruiters';
  connection.query(query, (err, recruiters) => {
    if (err) {
      console.error('Error fetching recruiters:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(recruiters);
  });
});

app.post('/delete-recruiter', (req, res) => {
  const recruiterId = req.body.recruiterId;
  const deleteQuery = 'DELETE FROM recruiters WHERE recruiter_id = ?';
  connection.query(deleteQuery, [recruiterId], (err, result) => {
    if (err) {
      console.error('Error deleting recruiter:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.send('Recruiter deleted successfully');
  });
});

app.post('/student-signup', (req, res) => {
  const { name, username, email, phone_number, password } = req.body;

  const student = {
    name,
    username, 
    password,
    email,
    phone_number,
  };

  const query = 'INSERT INTO students SET ?';

  connection.query(query, student, (error, results) => {
    if (error) {
      console.error('Error inserting student: ' + error.stack);
      res.status(500).send('Error inserting student');
      return;
    }
    console.log('Student added to the database');
    res.redirect('/register-student');
  });
});


app.get('/admin-dashboard', (req, res) => {
  res.render('adminDashboard'); 
});

app.get('/all-students', (req, res) => {
  connection.query('SELECT student_id, name, username, email, phone_number FROM students', (error, results) => {
    if (error) {
      console.error('Error fetching students:', error);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.json(results); 
  });
});

app.post('/delete-job', (req, res) => {
  const jobId = req.body.jobId;

  const query = 'DELETE FROM jobs WHERE job_id = ?';
  connection.query(query, [jobId], (error, results) => {
    if (error) {
      console.error('Error deleting job:', error);
      res.status(500).send('Error deleting job');
      return;
    }
    res.status(200).send('Job deleted successfully');
  });
});

const isStudentAuthenticated = (req, res, next) => {
  if (req.session && req.session.student_id) {
    return next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};



app.post('/student-login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const query = 'SELECT * FROM students WHERE username = ? AND password = ?';

  connection.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Error querying the database: ' + err.stack);
      return res.status(500).send('Internal Server Error');
    }

    if (results.length > 0) {
      req.session.student_id = results[0].student_id;
      res.redirect('/student-dashboard'); 
    } else {
      res.status(401).send('Invalid credentials');
    }
  });
});

app.post('/delete-student', (req, res) => {
  const studentId = req.body.studentId;

  const deleteQuery = 'DELETE FROM students WHERE student_id = ?';

  connection.query(deleteQuery, [studentId], (error, results) => {
    if (error) {
      console.error('Error deleting student:', error);
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send('Student deleted successfully');
    }
  });
});


app.post('/recruiter-login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const query = 'SELECT * FROM recruiters WHERE username = ? AND password = ?';

  connection.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Error querying the database: ' + err.stack);
      return res.status(500).send('Internal Server Error');
    }

    if (results.length > 0) {
      req.session.recruiterId = results[0].recruiter_id;
      console.log(req.session.recruiterId);

      res.redirect('/recruiter-dashboard');
    } else {
      res.status(401).send('Invalid credentials');
    }
  });
});


app.get('/all-applications', (req, res) => {
  const recruiterId = req.session ? req.session.recruiterId : null;

  if (!recruiterId) {
    return res.redirect('/recruiter-login'); 
  }

  const query = `
    SELECT applications.*, students.name as student_name, students.email as student_email, jobs.title as job_title
    FROM applications
    INNER JOIN students ON applications.student_id = students.student_id
    INNER JOIN jobs ON applications.job_id = jobs.job_id
    WHERE jobs.recruiter_id = ?;
  `;

  connection.query(query, [recruiterId], (error, results) => {
    if (error) {
      console.error('Error fetching applications:', error);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.json(results);
  });
});


app.post('/accept-application', (req, res) => {
  const applicationId = req.body.applicationId;

  const updateQuery = 'UPDATE applications SET status = ? WHERE application_id = ?';
  connection.query(updateQuery, ['accepted', applicationId], (updateError, updateResults) => {
    if (updateError) {
      console.error('Error updating application status:', updateError);
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send('Application accepted successfully');
    }
  });
});

app.post('/reject-application', (req, res) => {
  const applicationId = req.body.applicationId;

  const updateQuery = 'UPDATE applications SET status = ? WHERE application_id = ?';
  connection.query(updateQuery, ['rejected', applicationId], (updateError, updateResults) => {
    if (updateError) {
      console.error('Error updating application status:', updateError);
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send('Application rejected successfully');
    }
  });
});









app.get('/post-jobs', (req, res) => {
  const recruiterId = req.session ? req.session.recruiterId : null;

  if (!recruiterId) {
    return res.redirect('/recruiter-login'); 
  }

  res.render('postJobs'); 
});

app.post('/post-jobs', (req, res) => {
  const recruiterId = req.session ? req.session.recruiterId : null;
  console.log('Recruiter ID:', recruiterId);


  if (!recruiterId) {
    return res.redirect('/recruiter-login'); 
  }

  const { role, company_name, type, salary, description } = req.body;

  const job = {
    recruiter_id: recruiterId,
    company_name: company_name,
    title: role,
    description: description,
    type: type,
    salary: salary,
    created_at: new Date(),
  };

  const query = 'INSERT INTO jobs SET ?';

  connection.query(query, job, (error, results) => {
    if (error) {
      console.error('Error inserting job: ' + error.stack);
      res.status(500).send('Error posting job');
      return;
    }

    console.log('Job posted successfully');
    res.redirect('/post-jobs');
  });
});


app.get('/all-jobs', (req, res) => {
  const query = 'SELECT job_id, title, company_name, type, salary, description FROM jobs';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching jobs:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});

app.post('/delete-job', (req, res) => {
  const jobId = req.body.jobId;

  const query = 'DELETE FROM jobs WHERE job_id = ?';
  connection.query(query, [jobId], (error, results) => {
    if (error) {
      console.error('Error deleting job:', error);
      res.status(500).send('Error deleting job');
      return;
    }
    res.status(200).send('Job deleted successfully');
  });
});


app.get('/all-jobs', isStudentAuthenticated, (req, res) => {
  const query = 'SELECT job_id, title, company_name, type, salary, description FROM jobs';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching jobs:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});


app.post('/apply-job', isStudentAuthenticated, (req, res) => {
  const { job_id } = req.body;
  const student_id = req.session.student_id;

  console.log('Student applying for job:', job_id, 'by student:', student_id);

  connection.beginTransaction((transactionErr) => {
    if (transactionErr) {
      console.error('Error starting transaction:', transactionErr);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const checkQuery = 'SELECT * FROM applications WHERE job_id = ? AND student_id = ?';
    connection.query(checkQuery, [job_id, student_id], (checkError, checkResults) => {
      if (checkError) {
        console.error('Error checking duplicate application:', checkError);
        return connection.rollback(() => {
          res.status(500).json({ error: 'Internal Server Error' });
        });
      }

      if (checkResults.length > 0) {
        return connection.rollback(() => {
          res.status(400).json({ error: 'Already applied for this job' });
        });
      }

      const insertQuery = 'INSERT INTO applications (job_id, student_id, status) VALUES (?, ?, ?)';
      connection.query(insertQuery, [job_id, student_id, 'pending'], (applyError, applyResults) => {
        if (applyError) {
          console.error('Error applying for job:', applyError);
          return connection.rollback(() => {
            res.status(500).json({ error: 'Internal Server Error' });
          });
        }

        connection.commit((commitError) => {
          if (commitError) {
            console.error('Error committing transaction:', commitError);
            return connection.rollback(() => {
              res.status(500).json({ error: 'Internal Server Error' });
            });
          }

          console.log('Application successful:', applyResults);
          res.json({ success: true });
        });
      });
    });
  });
});


app.get('/check-application', isStudentAuthenticated, (req, res) => {
  const { job_id } = req.query;
  const student_id = req.session.student_id;

  const checkQuery = 'SELECT * FROM applications WHERE job_id = ? AND student_id = ?';
  connection.query(checkQuery, [job_id, student_id], (checkError, checkResults) => {
    if (checkError) {
      console.error('Error checking duplicate application:', checkError);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const applied = checkResults.length > 0;

    res.json({ applied });
  });
}); 





app.get('/get-job-id', (req, res) => {
  const recruiterId = req.session.recruiter_id;
  const query = 'SELECT job_id FROM jobs WHERE recruiter_id = ? LIMIT 1';

  connection.query(query, [recruiterId], (err, results) => {
    if (err) {
      console.error('Error fetching job ID:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const jobId = results.length > 0 ? results[0].job_id : null;
    res.json({ job_id: jobId });
  });
});

app.get('/job-applications/:jobId', (req, res) => {
  const jobId = req.params.jobId;
  const query = 'SELECT * FROM applications WHERE job_id = ?';

  connection.query(query, [jobId], (err, results) => {
    if (err) {
      console.error('Error fetching job applications:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.json(results);
  });
});

app.put('/update-status/:applicationId/:newStatus', (req, res) => {
  const { applicationId, newStatus } = req.params;
  const query = 'UPDATE applications SET status = ? WHERE application_id = ?';

  connection.query(query, [newStatus, applicationId], (err, results) => {
    if (err) {
      console.error('Error updating application status:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.json({ success: true });
  });
});



app.get('/all-students', (req, res) => {
  const query = 'SELECT * FROM students';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching student profiles:', error);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.json(results);
  }); 
});

























const PORT = 3000;
app.listen(PORT, (err) => {
  if (err) {
    console.error('Error starting the server:', err);
  } else {
    console.log(`Server listening on port ${PORT}`);
  }
});
