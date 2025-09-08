# Production Deployment Checklist

## Pre-Deployment

### Environment Configuration
- [ ] Set `NODE_ENV=production`
- [ ] Configure production database connection
- [ ] Set secure JWT secret (minimum 32 characters)
- [ ] Configure email service (SendGrid/SMTP)
- [ ] Set up Stripe production keys
- [ ] Configure CORS allowed origins
- [ ] Set appropriate rate limiting values
- [ ] Configure file upload limits

### Security
- [ ] Review and update all environment variables
- [ ] Ensure no sensitive data in code repository
- [ ] Configure SSL/TLS certificates
- [ ] Set up reverse proxy (Nginx/Apache)
- [ ] Configure firewall rules
- [ ] Enable security headers (Helmet)
- [ ] Review CORS configuration
- [ ] Set up rate limiting
- [ ] Configure data sanitization

### Database
- [ ] Set up production MongoDB instance
- [ ] Configure database connection pooling
- [ ] Create database indexes
- [ ] Set up database backup strategy
- [ ] Configure database monitoring
- [ ] Test database connection

### Infrastructure
- [ ] Set up production server
- [ ] Configure process manager (PM2)
- [ ] Set up load balancer (if needed)
- [ ] Configure CDN for static assets
- [ ] Set up monitoring and alerting
- [ ] Configure log rotation
- [ ] Set up backup systems

## Deployment

### Code Quality
- [ ] Run all tests (`npm test`)
- [ ] Run linting (`npm run lint`)
- [ ] Check code coverage
- [ ] Review security audit (`npm audit`)
- [ ] Build production assets (`npm run build`)

### Application Deployment
- [ ] Deploy application code
- [ ] Install production dependencies
- [ ] Run database migrations (if any)
- [ ] Start application with PM2
- [ ] Verify application startup
- [ ] Run health checks

### Verification
- [ ] Test all critical endpoints
- [ ] Verify authentication flow
- [ ] Test payment processing
- [ ] Check email functionality
- [ ] Verify file upload functionality
- [ ] Test error handling

## Post-Deployment

### Monitoring
- [ ] Set up application monitoring
- [ ] Configure error tracking
- [ ] Set up performance monitoring
- [ ] Configure uptime monitoring
- [ ] Set up log aggregation
- [ ] Configure alerting rules

### Backup & Recovery
- [ ] Verify database backups
- [ ] Test backup restoration
- [ ] Document recovery procedures
- [ ] Set up automated backups
- [ ] Test disaster recovery plan

### Documentation
- [ ] Update deployment documentation
- [ ] Document configuration changes
- [ ] Update API documentation
- [ ] Create operational runbooks
- [ ] Document troubleshooting procedures

### Performance
- [ ] Run performance tests
- [ ] Optimize database queries
- [ ] Configure caching
- [ ] Optimize static asset delivery
- [ ] Monitor resource usage

## Maintenance

### Regular Tasks
- [ ] Monitor application logs
- [ ] Review security alerts
- [ ] Update dependencies
- [ ] Review performance metrics
- [ ] Check backup integrity
- [ ] Monitor disk space
- [ ] Review error rates

### Security Updates
- [ ] Apply security patches
- [ ] Update SSL certificates
- [ ] Review access logs
- [ ] Update firewall rules
- [ ] Rotate secrets/keys
- [ ] Review user permissions

## Emergency Procedures

### Rollback Plan
- [ ] Document rollback procedures
- [ ] Test rollback process
- [ ] Prepare rollback scripts
- [ ] Define rollback triggers
- [ ] Assign rollback responsibilities

### Incident Response
- [ ] Define incident response team
- [ ] Create incident response procedures
- [ ] Set up communication channels
- [ ] Define escalation procedures
- [ ] Prepare status page

## Tools and Commands

### Deployment
```bash
# Deploy to production
npm run deploy production

# Start with PM2
npm run pm2:start

# Check application status
npm run pm2:monit
```

### Monitoring
```bash
# View logs
npm run pm2:logs

# Check health
curl http://localhost:3000/health

# Monitor resources
htop
```

### Backup
```bash
# Create backup
npm run backup

# Restore from backup
npm run restore backup_file.gz
```

### Security
```bash
# Security audit
npm run security:audit

# Check for vulnerabilities
npm run security:check
```

## Contact Information

- **DevOps Team**: devops@company.com
- **On-Call Engineer**: +1-xxx-xxx-xxxx
- **Emergency Contact**: emergency@company.com

## Resources

- [Application Documentation](README.md)
- [API Documentation](docs/api.md)
- [Monitoring Dashboard](https://monitoring.company.com)
- [Status Page](https://status.company.com)
