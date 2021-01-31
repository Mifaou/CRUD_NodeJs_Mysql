var express = require('express')
var app = express()

app.get('/', function(req, res, next) {
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM users ORDER BY id DESC',function(err, rows, fields) {
			if (err) {
				req.flash('error', err)
				res.render('user/list', {
					title: 'User List', 
					data: ''
				})
			} else {
				res.render('user/list', {
					title: 'User List', 
					data: rows
				})
			}
		})
	})
})

app.get('/add', function(req, res, next){	
	res.render('user/add', {
		title: 'Add New User',
		fname: '',
		lname: '',
		age: '',
		email: '',
		country: '',
		phone: ''

	})
})

app.post('/add', function(req, res, next){	
	req.assert('fname', 'First Name is required').notEmpty()  
	req.assert('lname', 'Last Name is required').notEmpty()
	req.assert('age', 'Age is required').notEmpty() 
	req.assert('email', 'Email is required').isEmail()       
	req.assert('country', 'Country is required').notEmpty()            
    req.assert('phone', 'A valid email is required').notEmpty() 

    var errors = req.validationErrors()
  
    if( !errors ) {   
		
	
		var user = {
			fname: req.sanitize('fname').escape().trim(),
			lname: req.sanitize('lname').escape().trim(),

			age: req.sanitize('age').escape().trim(),
			email: req.sanitize('email').escape().trim(),
			country: req.sanitize('country').escape().trim(),
			phone: req.sanitize('phone').escape().trim()


		}
		
		req.getConnection(function(error, conn) {
			conn.query('INSERT INTO users SET ?', user, function(err, result) {
				if (err) {
					req.flash('error', err)
					
					res.render('user/add', {
						title: 'Add New User',
						fname: user.fname,
						lname: user.lname,
						age: user.age,
						email: user.email,
						country: user.country,	
						phone: user.phone,		
					})
				} else {				
					req.flash('success', 'Data added successfully!')
					
					res.render('user/add', {
						title: 'Add New User',
						fname: '',
						lname: '',
						age: '',
						email: ''	,
						country: '',	
						phone :''		
					})
				}
			})
		})
	}
	else {   
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})				
		req.flash('error', error_msg)		
		
		
        res.render('user/add', { 
            title: 'Add New User',
			fname: req.body.fname,
			lname: req.body.lname,
            age: req.body.age,
			email: req.body.email,
			country: req.body.country,
			phone: req.body.phone
        })
    }
})

app.get('/edit/(:id)', function(req, res, next){
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM users WHERE id = ?', [req.params.id], function(err, rows, fields) {
			if(err) throw err
			
			if (rows.length <= 0) {
				req.flash('error', 'User not found with id = ' + req.params.id)
				res.redirect('/users')
			}
			else { 
				res.render('user/edit', {
					title: 'Edit User', 
					id: rows[0].id,
					fname: rows[0].fname,
					lname: rows[0].lname,
					age: rows[0].age,
					email: rows[0].email,
					country: rows[0].country,	
					phone: rows[0].phone			
				})
			}			
		})
	})
})

app.put('/edit/(:id)', function(req, res, next) {
	req.assert('fname', 'First Name is required').notEmpty() 
	req.assert('lname', 'Last Name is required').notEmpty()            
	req.assert('age', 'Age is required').notEmpty()            
	req.assert('email', 'A valid email is required').isEmail()
	req.assert('country', 'Country is required').notEmpty() 
	req.assert('phone', 'Phone is required').notEmpty()       

    var errors = req.validationErrors()
    
    if( !errors ) {   
		
		
		var user = {
			fname: req.sanitize('fname').escape().trim(),
			lname: req.sanitize('lname').escape().trim(),
			age: req.sanitize('age').escape().trim(),
			email: req.sanitize('email').escape().trim(),
		country: req.sanitize('country').escape().trim(),
		phone: req.sanitize('phone').escape().trim()
		
		}
		
		req.getConnection(function(error, conn) {
			conn.query('UPDATE users SET ? WHERE id = ' + req.params.id, user, function(err, result) {
				if (err) {
					req.flash('error', err)
					
					res.render('user/edit', {
						title: 'Edit User',
						id: req.params.id,
						fname: req.body.fname,
						lname: req.body.lname,
						age: req.body.age,
						email: req.body.email,
						country: req.body.country,
						phone: req.body.phone
					})
				} else {
					req.flash('success', 'Data updated successfully!')
					
					res.render('user/edit', {
						title: 'Edit User',
						id: req.params.id,
						fname: req.body.fname,
						lname: req.body.lname,
						age: req.body.age,
						email: req.body.email,
						country: req.body.country,
						phone: req.body.phone
					})
				}
			})
		})
	}
	else {  
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)
		
        res.render('user/edit', { 
            title: 'Edit User',            
			id: req.params.id,
						fname: req.body.fname,
						lname: req.body.lname,
						age: req.body.age,
						email: req.body.email,
						country: req.body.country,
						phone: req.body.phone
        })
    }
})

app.delete('/delete/(:id)', function(req, res, next) {
	var user = { id: req.params.id }
	
	req.getConnection(function(error, conn) {
		conn.query('DELETE FROM users WHERE id = ' + req.params.id, user, function(err, result) {
			if (err) {
				req.flash('error', err)
				res.redirect('/users')
			} else {
				req.flash('success', 'User deleted successfully! id = ' + req.params.id)
				res.redirect('/users')
			}
		})
	})
})

module.exports = app
