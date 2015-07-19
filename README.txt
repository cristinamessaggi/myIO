OVERVIEW

MyIO (My Incomes and Outcomes) is a PROTOTYPE application developed in 2012 as 
part of my dissertation on mobile application development in order to support 
a better understanding of the process.

The idea for the application prototype was based on a personal habit of logging 
my finance incomes and outcomes on a Microsoft Excel spreadsheet, having formulas
calculating daily and monthly balances. This is a simple but efficient method 
which helped me staying in control of my accounts.

MyIO was developed as a web application allowing it to run cross devices with 
a single implementation. It was implemented using HTML5, CSS and Javascript,
tested, and integrated to run on a mobile web browser. 


DEVELOPMENT PLAN - INCREMENTAL PROCESS

FR: Functional Requirement
PR: Performance Requirement
DM: Development Module
UT: Unit Test

Iteration 1:

FR-001	the application shall check if database exists.
DM-001	check if database exists.
UT-001 	check if application validates database existence.

FR-002 	if database does not exist, application shall create database based on current 
	month and defined number of months ahead (coded as 3), with default values for 
	value and description as empty and balance as “0”.
DM-002 	if database does not exist, create database based on current month and defined
	number of months ahead (coded as 3)
	set value for value for description = “”
	set value for balance = 0
UT-002 	check if database is created based on current month and 3 months ahead.
	check if database values match expected values:
	value for description = “”
	balance = 0

Iteration 2:

FR-008	the application shall provide reset option.
DM-008 	code to include reset option.
UT-008 	check if application provides for the user facility to reset database.

FR-009 	the application shall delete database upon reset option selected by the user.
DM-009 	code option to delete database.
UT-009 	check if application deletes database upon user request.

Iteration 3:

FR-003	the application shall display list of months based on database.
DM-003 	code to display list of months based on database.
UT-003 	check if application displays expected list of months.

FR-010 	deletion of the database shall trigger Database Creation.
DM-010 	code to trigger Database Creation upon database deletion.
UT-010 	check if application creates database upon database deletion.

Iteration 4:

FR-004 	the application shall display list of the days for a selected month and their
	data (value, description and balance).
DM-004 	code to display list of days for the selected month.
	code to display data (value, description and balance) of each listed day.
UT-004 	check if application displays expected list of days and data.

Iteration 5:

FR-005 	after selection of a particular day from the list of days for a selected month, 
	the application shall provide facility for the user to update value and
	description of the selected day.
DM-005 	include fields for value and description update after day selection.
UT-005 	check if application provides facility to update value and description for a
	selected day.

Iteration 6:

FR-006 	the application shall update on database value and description of selected day.
DM-006 	code to update value and description of selected day on database after update
	confirmation.
UT-006 	check if application updates correctly value and description of selected day.

Iteration 7:

FR-007 	the application shall calculate and update on database selected and subsequent
	day balances.
DM-007 	code to calculate and update selected and subsequent day balances on database.
UT-007 	check if application calculates balances correctly.
	check if application updates change on balances correctly.

Iteration 8:

PR-001 	the application shall run without internet connection (offline).
DM-010 	include manifest code (offline capability).
UT-010 	check if application runs offline (save the bookmark and change to airplane 
	mode).
