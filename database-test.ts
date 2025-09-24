import { supabase } from './src/lib/supabase';

// Database health check utility
export async function testDatabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test 1: Check if we can connect to Supabase
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true });
    
    if (testError) {
      console.error('Database connection test failed:', testError);
      return {
        success: false,
        error: testError.message,
        details: testError
      };
    }
    
    console.log('✅ Database connection successful');
    
    // Test 2: Check if user is authenticated
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('User authentication test failed:', userError);
      return {
        success: false,
        error: 'User not authenticated: ' + userError.message,
        details: userError
      };
    }
    
    if (!userData.user) {
      return {
        success: false,
        error: 'No authenticated user found',
        details: null
      };
    }
    
    console.log('✅ User authenticated:', userData.user.id);
    
    // Test 3: Try to read from profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userData.user.id)
      .maybeSingle();
    
    if (profileError) {
      console.error('Profile read test failed:', profileError);
      return {
        success: false,
        error: 'Cannot read from profiles table: ' + profileError.message,
        details: profileError
      };
    }
    
    console.log('✅ Profiles table accessible');
    console.log('Profile data:', profileData);
    
    return {
      success: true,
      user: userData.user,
      profile: profileData,
      message: 'All database tests passed'
    };
    
  } catch (error: any) {
    console.error('Database test failed with exception:', error);
    return {
      success: false,
      error: error.message || 'Unknown error',
      details: error
    };
  }
}

// Function to test profile creation
export async function testProfileCreation(profileData: {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}) {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userData.user.id,
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Profile creation test failed:', error);
      return {
        success: false,
        error: error.message,
        details: error
      };
    }
    
    console.log('✅ Profile created/updated successfully:', data);
    
    return {
      success: true,
      profile: data,
      message: 'Profile creation test passed'
    };
    
  } catch (error: any) {
    console.error('Profile creation test failed:', error);
    return {
      success: false,
      error: error.message || 'Unknown error',
      details: error
    };
  }
}