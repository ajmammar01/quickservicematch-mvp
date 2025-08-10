import { PrismaClient } from '@prisma/client';
import citiesData from './data/cities';
import serviceTypesData from './data/serviceTypes';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Test database connection first
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('✓ Database connection successful');

    // Clear existing data safely (only if tables exist and have data)
    console.log('Clearing existing data...');
    
    try {
      // Clear in correct order (providers first, then service types and cities)
      const providerCount = await prisma.provider.count();
      if (providerCount > 0) {
        await prisma.provider.deleteMany();
        console.log(`✓ Cleared ${providerCount} providers`);
      } else {
        console.log('✓ No providers to clear');
      }
    } catch (error) {
      console.log('ℹ️ Provider table might not exist yet, skipping cleanup');
    }
    
    try {
      const serviceTypeCount = await prisma.serviceType.count();
      if (serviceTypeCount > 0) {
        await prisma.serviceType.deleteMany();
        console.log(`✓ Cleared ${serviceTypeCount} service types`);
      } else {
        console.log('✓ No service types to clear');
      }
    } catch (error) {
      console.log('ℹ️ ServiceType table might not exist yet, skipping cleanup');
    }
    
    try {
      const cityCount = await prisma.city.count();
      if (cityCount > 0) {
        await prisma.city.deleteMany();
        console.log(`✓ Cleared ${cityCount} cities`);
      } else {
        console.log('✓ No cities to clear');
      }
    } catch (error) {
      console.log('ℹ️ City table might not exist yet, skipping cleanup');
    }

    // Seed cities
    console.log('Seeding cities...');
    for (const cityData of citiesData) {
      await prisma.city.create({
        data: {
          name: cityData.name,
          country: cityData.country,
          slug: cityData.slug,
        },
      });
    }
    console.log(`✓ Seeded ${citiesData.length} cities`);

    // Seed service types
    console.log('Seeding service types...');
    for (const serviceData of serviceTypesData) {
      await prisma.serviceType.create({
        data: {
          name: serviceData.name,
          slug: serviceData.slug,
        },
      });
    }
    console.log(`✓ Seeded ${serviceTypesData.length} service types`);

    // Add minimal fake providers for testing
    console.log('Seeding minimal fake providers...');
    const providers = [
      // Amsterdam providers
      {
        name: 'Test Plumbing Amsterdam',
        service: 'Plumbing',
        city: 'Amsterdam',
        country: 'Netherlands',
        contact: 'test.plumber.amsterdam@example.com',
        website: 'https://test-plumber-amsterdam.example.com',
        whatsapp: '+31600000001',
        contactMethod: 'email',
      },
      {
        name: 'Test Electrician Amsterdam',
        service: 'Electrician',
        city: 'Amsterdam',
        country: 'Netherlands',
        contact: 'test.electrician.amsterdam@example.com',
        website: 'https://test-electrician-amsterdam.example.com',
        whatsapp: '+31600000002',
        contactMethod: 'email',
      },
      {
        name: 'Test Cleaning Amsterdam',
        service: 'Home Cleaning',
        city: 'Amsterdam',
        country: 'Netherlands',
        contact: 'test.cleaning.amsterdam@example.com',
        website: 'https://test-cleaning-amsterdam.example.com',
        whatsapp: '+31600000003',
        contactMethod: 'email',
      },
      
      // Rotterdam providers
      {
        name: 'Test Plumbing Rotterdam',
        service: 'Plumbing',
        city: 'Rotterdam',
        country: 'Netherlands',
        contact: 'test.plumber.rotterdam@example.com',
        website: 'https://test-plumber-rotterdam.example.com',
        whatsapp: '+31600000004',
        contactMethod: 'email',
      },
      {
        name: 'Test Electrician Rotterdam',
        service: 'Electrician',
        city: 'Rotterdam',
        country: 'Netherlands',
        contact: 'test.electrician.rotterdam@example.com',
        website: 'https://test-electrician-rotterdam.example.com',
        whatsapp: '+31600000005',
        contactMethod: 'email',
      },
      
      // Brussels providers
      {
        name: 'Test Plumbing Brussels',
        service: 'Plumbing',
        city: 'Brussels',
        country: 'Belgium',
        contact: 'test.plumber.brussels@example.com',
        website: 'https://test-plumber-brussels.example.com',
        whatsapp: '+32600000006',
        contactMethod: 'email',
      },
      {
        name: 'Test HVAC Brussels',
        service: 'HVAC',
        city: 'Brussels',
        country: 'Belgium',
        contact: 'test.hvac.brussels@example.com',
        website: 'https://test-hvac-brussels.example.com',
        whatsapp: '+32600000007',
        contactMethod: 'email',
      },
    ];

    for (const provider of providers) {
      await prisma.provider.create({
        data: provider,
      });
    }
    console.log(`✓ Seeded ${providers.length} providers`);

    console.log('✅ Database seeding completed successfully!');
    
    // Print summary
    const finalCityCount = await prisma.city.count();
    const finalServiceTypeCount = await prisma.serviceType.count();
    const finalProviderCount = await prisma.provider.count();
    
    console.log(`📊 Final Summary:`);
    console.log(`   Cities: ${finalCityCount}`);
    console.log(`   Service Types: ${finalServiceTypeCount}`);
    console.log(`   Providers: ${finalProviderCount}`);

  } catch (error) {
    if (error.message?.includes('Tenant or user not found')) {
      console.error('❌ Database connection failed: Invalid credentials or tenant not found');
      console.error('ℹ️ Please check your DATABASE_URL in .env file');
      console.error('ℹ️ Make sure your Supabase project is active and credentials are correct');
    } else {
      console.error('❌ Error during seeding:', error);
    }
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e.message || e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
