# Create user

/api/v1/users

# Create Group

/api/v1/groups

# Create contributor

/api/v1/contributors

# Create contributions

/api/v1/contributions

# ====================================================

1. User registered and taken to a dashboard where he will create a contribution group
2. He should be able to create a group for the contribution
   a. this group should then be linked with the user that creates it ===> /api/v1/groups
   a. He should get the detail of a group and in there should be a button to add contributors ===> /api/v1/groups/groupID/contributors
3. He should be able to create many contributors under each group he created
   a. the contributors must be linked back to each group for separation of concern
   b. the contibutors must also be linked to the user that created them
4. He should be able to create many contributions on behalf of all contributors under each group
   a. Each contributions must be linked to a contributor
   b. Each contributions must be linked to a group that it belongs to
   c. Each contributions must be linked to a user that creates it

a. /api/v1/groups ==> done
create and get all groups
b. /api/v1/groups/groupID ==> done
get the detail of a group
c. /api/v1/groups/groupID/contributors ==> done
create contributors
c1.
d. /api/v1/groups/groupID/contributors/contributorID ==> done
get the detail of a contributor
e. /api/v1/groups/groupID/contributors/contributorID/owedContributors
get all owedContributors
f. /api/v1/groups/groupID/contributors/contributorID/owedContributors/owedContributorsID
get the details of an owedContributor
