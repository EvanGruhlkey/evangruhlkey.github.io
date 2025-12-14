// Script to clean up orphaned auth users (users in Auth but not in database)
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function cleanupOrphanedUsers() {
  console.log('🔍 Finding orphaned auth users...\n');

  try {
    // Get all auth users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error fetching auth users:', authError);
      return;
    }

    console.log(`Found ${authUsers.users.length} auth users\n`);

    // Get all database users
    const { data: dbUsers, error: dbError } = await supabase
      .from('users')
      .select('id, email');

    if (dbError) {
      console.error('❌ Error fetching database users:', dbError);
      return;
    }

    const dbUserIds = new Set(dbUsers.map(u => u.id));
    const orphanedUsers = authUsers.users.filter(u => !dbUserIds.has(u.id));

    if (orphanedUsers.length === 0) {
      console.log('✅ No orphaned users found!');
      return;
    }

    console.log(`Found ${orphanedUsers.length} orphaned auth users:\n`);
    
    orphanedUsers.forEach((user, i) => {
      console.log(`${i + 1}. ${user.email} (ID: ${user.id})`);
    });

    console.log('\n⚠️  Deleting orphaned users...\n');

    for (const user of orphanedUsers) {
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) {
        console.error(`❌ Failed to delete ${user.email}:`, error.message);
      } else {
        console.log(`✓ Deleted ${user.email}`);
      }
    }

    console.log('\n✅ Cleanup complete!');

  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  }
}

// Run if called directly
if (require.main === module) {
  console.log('🧹 Supabase Auth Cleanup Tool\n');
  console.log('This will delete auth users that don\'t have profiles in the database.\n');
  
  cleanupOrphanedUsers()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { cleanupOrphanedUsers };



