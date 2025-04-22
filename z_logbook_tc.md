# Precondition:
# Steps
# Expected result

Verify that the Instructor member has a "My QR Code" section under the More tab  
# Precondition:
Has a Pro - Instructor account  
todd.hunter@padi.co  
# Steps
1. Log in with the account specified in the precondition.
2. Go to the More tab.
3. Click on the "My QR Code" section.
# Expected result
2. The "My QR Code" section is visible.
3. A page is displayed with a QR Code and a "Download QR Code" button.

Verify that the Instructor has a "My QR Code" section under the More tab with valid information  
# Precondition:
Has a Pro - Instructor account  
todd.hunter@padi.co  
# Steps
1. Log in with the account specified in the precondition.
2. Go to the More tab.
3. Click on the "My QR Code" section.
4. Scan or decode the QR code using an external tool.
# Expected result
4. The QR code contains a URL with the following information: firstName=$first_name, lastName=$last_name, instructorNumber=$instructor_number

Verify that the Instructor is able to download the QR code  
# Precondition:
Has a Pro - Instructor account  
todd.hunter@padi.co  
# Steps
1. Log in with the account specified in the precondition.
2. Go to the More tab.
3. Click on the "My QR Code" section.
4. Click on the "Download QR Code" button.
# Expected result
4. The QR code can be downloaded to the photo gallery or download folder. The downloaded QR code should match the displayed QR code.

Verify that the Store member does not have a "My QR Code" section under the More tab  
# Precondition:
Has a Pro - Store account  
rigger1@padi.com
# Steps
1. Log in with the account specified in the precondition.
2. Go to the More tab.
# Expected result
2. The "My QR Code" section is not visible.

Verify that the Consumer/Student member does not have a "My QR Code" section under the More tab  
# Precondition:
Has a Consumer/Student account  
# Steps
1. Log in with the account specified in the precondition.
2. Go to the More tab.
# Expected result
2. The "My QR Code" section is not visible.



Verify that there is no Error displayed when clicking the Cancel creating Training Dive



Verify that the Error displayed when trying to save a creating Training Dive at General tab
# Precondition:
Has a valid account and a logbook with flexible skills is not created
# Steps
1. Log in with the account specified in the precondition.
2. Go to the Logbook tab.
3. Tap Add > Training dive and select one in the predoncitioon
4. Tap Save
5. Swipe to Training Dive Skills tab
# Expected result
4. Error message show for Dive Site,  Type of Dive, Max Depth, Bottom Time
5. Error message show for the Dive Skills
